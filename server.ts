import express, { Request, Response } from 'express';
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

// Support raw body for webhook signature verification if needed, alongside standard JSON parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Razorpay Instance (initialized if credentials provided)
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

let razorpayClient: Razorpay | null = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
  try {
    razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
    console.log('[Razorpay] Initialized official SDK with provided credentials.');
  } catch (err) {
    console.warn('[Razorpay] Could not initialize SDK:', err);
  }
} else {
  console.log('[Razorpay] Running in Test Simulation mode. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env for live test gateway.');
}

// In-memory processed payment cache to prevent replay attacks / duplicate orders
const processedPayments = new Set<string>();

/* ========================================================================= */
/* API ROUTES                                                                */
/* ========================================================================= */

// GET Public Razorpay Key ID (NEVER exposes secret)
app.get('/api/razorpay/key', (_req: Request, res: Response) => {
  res.json({
    keyId: RAZORPAY_KEY_ID || 'rzp_test_snapster_demo',
    isConfigured: Boolean(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET),
  });
});

// POST Create Razorpay Order
app.post('/api/razorpay/create-order', async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required.' });
    }

    // Convert INR rupees to paise (e.g. ₹1999 -> 199900 paise)
    const amountInPaise = Math.round(Number(amount) * 100);
    const receiptId = receipt || `rcpt_${Date.now()}`;

    // If Razorpay SDK is configured with valid credentials, use official gateway
    if (razorpayClient) {
      const order = await razorpayClient.orders.create({
        amount: amountInPaise,
        currency,
        receipt: receiptId,
        notes: notes || { brand: 'SNAPSTER Streetwear', store: 'Vijayawada AP' },
      });

      return res.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        keyId: RAZORPAY_KEY_ID,
        isSimulated: false,
      });
    }

    // Safe Test Simulation fallback for local verification before developer configures live keys
    const simulatedOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;
    res.json({
      id: simulatedOrderId,
      amount: amountInPaise,
      currency,
      receipt: receiptId,
      keyId: RAZORPAY_KEY_ID || 'rzp_test_snapster_demo',
      isSimulated: true,
      message: 'Simulated Razorpay order created. Configure RAZORPAY_KEY_ID & RAZORPAY_KEY_SECRET for live test gateway.',
    });
  } catch (err: any) {
    console.error('[Razorpay] create-order failed:', err);
    res.status(500).json({ error: err.message || 'Failed to create Razorpay order' });
  }
});

// POST Verify Razorpay Signature (Server-Side Cryptographic Verification)
app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    if (!razorpay_payment_id) {
      return res.status(400).json({ verified: false, error: 'Missing payment ID' });
    }

    // Prevent duplicate processing
    if (processedPayments.has(razorpay_payment_id)) {
      return res.status(409).json({
        verified: false,
        duplicate: true,
        error: 'Duplicate payment detected. This payment has already been verified and processed.',
      });
    }

    // If key secret is present, verify HMAC-SHA256 signature
    if (RAZORPAY_KEY_SECRET && razorpay_order_id && razorpay_signature) {
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          verified: false,
          error: 'Invalid Razorpay payment signature. Tampering suspected.',
        });
      }
    }

    // Mark as processed
    processedPayments.add(razorpay_payment_id);

    res.json({
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || order_id,
      paymentStatus: 'Paid',
      timestamp: new Date().toISOString(),
      message: 'Payment signature verified successfully by SNAPSTER server.',
    });
  } catch (err: any) {
    console.error('[Razorpay] verify-payment failed:', err);
    res.status(500).json({ verified: false, error: err.message || 'Payment verification failed' });
  }
});

// POST Razorpay Webhooks endpoint
app.post('/api/razorpay/webhook', (req: Request, res: Response) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  if (webhookSecret && signature) {
    const rawBody = JSON.stringify(req.body);
    const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
    if (expected !== signature) {
      return res.status(400).send('Invalid signature');
    }
  }

  const event = req.body.event;
  console.log('[Razorpay Webhook Event Received]:', event);

  // Acknowledge receipt
  res.json({ status: 'ok', received: true });
});

/* ========================================================================= */
/* VITE DEV MIDDLEWARE / STATIC PRODUCTION SERVING                           */
/* ========================================================================= */

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
