import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Preserve the exact incoming JSON bytes for Razorpay webhook HMAC verification.
type RequestWithRawBody = Request & { rawBody?: Buffer };
app.use(express.json({
  verify: (req, _res, buffer) => {
    (req as RequestWithRawBody).rawBody = Buffer.from(buffer);
  },
}));
app.use(express.urlencoded({ extended: true }));

// Never read a Razorpay secret from a Vite-prefixed/public environment variable.
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

let razorpayClient: Razorpay | null = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
  console.log('[Razorpay] Server SDK initialized.');
} else {
  console.error('[Razorpay] Credentials are missing. Online payments are disabled.');
}

// Temporary process-local replay guard only. Replace with a durable Firestore
// transaction/unique payment record before running multiple instances.
const processedPayments = new Set<string>();

function safeHexEqual(actual: string, expected: string): boolean {
  if (!/^[a-f0-9]+$/i.test(actual) || !/^[a-f0-9]+$/i.test(expected)) return false;
  const actualBuffer = Buffer.from(actual, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

app.get('/api/razorpay/key', (_req: Request, res: Response) => {
  if (!razorpayClient || !RAZORPAY_KEY_ID) {
    return res.status(503).json({ error: 'Online payments are not configured.' });
  }
  return res.json({ keyId: RAZORPAY_KEY_ID, isConfigured: true });
});

app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    if (!razorpayClient) {
      return res.status(503).json({ error: 'Online payments are not configured.' });
    }

    const amount = Number(req.body?.amount);
    const currency = req.body?.currency || 'INR';
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      return res.status(400).json({ error: 'A valid order amount is required.' });
    }
    if (currency !== 'INR') {
      return res.status(400).json({ error: 'Only INR payments are supported.' });
    }

    const amountInPaise = Math.round(amount * 100);
    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return res.status(400).json({ error: 'Invalid payment amount.' });
    }

    const receiptId = typeof req.body?.receipt === 'string'
      ? req.body.receipt.slice(0, 40)
      : `snapster_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;

    const order = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: { brand: 'SNAPSTER Streetwear' },
    });

    return res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error('[Razorpay] create-order failed:', err);
    return res.status(500).json({ error: 'Unable to create payment order.' });
  }
});

app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  try {
    if (!RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ verified: false, error: 'Payment verification is not configured.' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    if (
      typeof razorpay_order_id !== 'string' ||
      typeof razorpay_payment_id !== 'string' ||
      typeof razorpay_signature !== 'string' ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({ verified: false, error: 'Missing required Razorpay payment details.' });
    }

    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(409).json({ verified: false, duplicate: true, error: 'Payment was already processed.' });
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');

    if (!safeHexEqual(razorpay_signature, expectedSignature)) {
      return res.status(400).json({ verified: false, error: 'Invalid Razorpay payment signature.' });
    }

    processedPayments.add(razorpay_payment_id);
    return res.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'Signature Verified',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Razorpay] verify-payment failed:', err);
    return res.status(500).json({ verified: false, error: 'Payment verification failed.' });
  }
});

app.post('/api/razorpay/webhook', (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (!webhookSecret || typeof signature !== 'string') {
    return res.status(503).send('Webhook verification is not configured.');
  }

  const rawBody = (req as RequestWithRawBody).rawBody;
  if (!rawBody) {
    return res.status(400).send('Missing raw webhook body.');
  }

  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (!safeHexEqual(signature, expected)) {
    return res.status(400).send('Invalid webhook signature.');
  }

  const event = req.body?.event;
  console.log('[Razorpay Webhook Event Received]:', event || 'unknown');
  // Event persistence/order-state updates must be implemented before relying on
  // webhooks for fulfillment. Acknowledge only after signature validation.
  return res.json({ status: 'ok', received: true });
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[SNAPSTER] Server active on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
});
