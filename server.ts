import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { DocumentReference } from 'firebase-admin/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3000);
const isProd = process.env.NODE_ENV === 'production';
const ADMIN_EMAILS = new Set(['santhirajugonnabattula@gmail.com', 'admin@snapster.in']);

type RequestWithRawBody = Request & { rawBody?: Buffer; user?: { uid: string; email?: string; email_verified?: boolean } };

app.use(express.json({
  limit: '256kb',
  verify: (req, _res, buffer) => {
    (req as RequestWithRawBody).rawBody = Buffer.from(buffer);
  },
}));
app.use(express.urlencoded({ extended: true, limit: '32kb' }));

function safeHexEqual(actual: string, expected: string): boolean {
  if (!/^[a-f0-9]+$/i.test(actual) || !/^[a-f0-9]+$/i.test(expected)) return false;
  const a = Buffer.from(actual, 'hex');
  const b = Buffer.from(expected, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function loadFirebaseAdmin() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    console.error('[Firebase Admin] FIREBASE_SERVICE_ACCOUNT_JSON is missing. Secure order APIs are disabled.');
    return null;
  }
  try {
    const serviceAccount = JSON.parse(raw);
    const adminApp = getApps().length ? getApps()[0] : initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });
    const databaseId = process.env.FIREBASE_DATABASE_ID;
    const db = databaseId && databaseId !== '(default)'
      ? getFirestore(adminApp, databaseId)
      : getFirestore(adminApp);
    return { auth: getAuth(adminApp), db };
  } catch (error) {
    console.error('[Firebase Admin] Could not initialize Admin SDK. Check service-account JSON and database ID.', error);
    return null;
  }
}

const firebaseAdmin = loadFirebaseAdmin();
const keyId = process.env.RAZORPAY_KEY_ID || '';
const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
const razorpay = keyId && keySecret
  ? new Razorpay({ key_id: keyId, key_secret: keySecret })
  : null;

async function requireUser(req: Request, res: Response, next: NextFunction) {
  if (!firebaseAdmin) return res.status(503).json({ error: 'Secure checkout is not configured on the server.' });
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return res.status(401).json({ error: 'Please sign in before checkout.' });
  try {
    const decoded = await firebaseAdmin.auth.verifyIdToken(match[1], true);
    if (!decoded.email || decoded.email_verified !== true) {
      return res.status(403).json({ error: 'Please verify your email address before checkout.' });
    }
    (req as RequestWithRawBody).user = {
      uid: decoded.uid,
      email: decoded.email,
      email_verified: decoded.email_verified,
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please sign in again.' });
  }
}

async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as RequestWithRawBody).user;
  if (!user) return res.status(401).json({ error: 'Authentication required.' });
  if (user.email_verified !== true || !user.email || !ADMIN_EMAILS.has(user.email.toLowerCase())) {
    return res.status(403).json({ error: 'Administrator access is required.' });
  }
  return next();
}

function validText(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
}

function validateAddress(value: any) {
  return value && validText(value.fullName, 100) &&
    validText(value.phone, 20) && /^[0-9+()\-\s]{10,20}$/.test(value.phone) &&
    validText(value.street, 250) && validText(value.city, 80) &&
    validText(value.state, 80) && typeof value.pincode === 'string' && /^[0-9]{6}$/.test(value.pincode);
}

type PricedItem = {
  productId: string; name: string; price: number; image: string;
  size: string; color: string; quantity: number;
};

async function markPaymentCaptured(payment: any) {
  if (!firebaseAdmin || !payment?.id || !payment?.order_id) throw new Error('Payment data is incomplete.');
  const { db } = firebaseAdmin;
  const orderQuery = await db.collection('orders').where('razorpayOrderId', '==', payment.order_id).limit(1).get();
  if (orderQuery.empty) throw new Error('No SNAPSTER order matches this payment.');
  const orderRef = orderQuery.docs[0].ref;
  const paymentRef = db.collection('paymentEvents').doc(String(payment.id));

  await db.runTransaction(async (tx) => {
    const [orderSnap, paymentSnap] = await Promise.all([tx.get(orderRef), tx.get(paymentRef)]);
    if (!orderSnap.exists) throw new Error('Order not found.');
    if (paymentSnap.exists) {
      if (paymentSnap.data()?.orderId !== orderRef.id) throw new Error('Payment ID is already linked to another order.');
      return;
    }
    const order = orderSnap.data()!;
    const expectedAmount = Math.round(Number(order.total) * 100);
    if (payment.status !== 'captured' || payment.currency !== 'INR' ||
        Number(payment.amount) !== expectedAmount || payment.order_id !== order.razorpayOrderId) {
      throw new Error('Captured payment amount, currency, or order does not match.');
    }
    if (order.paymentStatus === 'Paid') {
      if (order.paymentId !== payment.id) throw new Error('A different payment is already recorded for this order.');
      tx.create(paymentRef, { orderId: orderRef.id, paymentId: payment.id, createdAt: FieldValue.serverTimestamp() });
      return;
    }
    if (order.paymentStatus !== 'Pending') throw new Error('Order is not awaiting online payment.');
    tx.update(orderRef, {
      paymentStatus: 'Paid',
      paymentId: payment.id,
      paymentMethod: 'Razorpay',
      status: 'Confirmed',
      updatedAt: new Date().toISOString(),
    });
    tx.create(paymentRef, { orderId: orderRef.id, paymentId: payment.id, createdAt: FieldValue.serverTimestamp() });
  });
  const finalOrder = await orderRef.get();
  return { id: finalOrder.id, ...finalOrder.data() };
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    checkoutConfigured: Boolean(firebaseAdmin),
    onlinePaymentsConfigured: Boolean(firebaseAdmin && razorpay),
  });
});

app.get('/api/razorpay/key', (_req, res) => {
  if (!razorpay) return res.status(503).json({ error: 'Online payments are not configured.' });
  return res.json({ keyId, isConfigured: true });
});

// The server recalculates every price and shipping charge from Firestore.
// Client-submitted totals, discounts, names, images and stock values are ignored.
app.post('/api/orders', requireUser, async (req: Request, res: Response) => {
  if (!firebaseAdmin) return res.status(503).json({ error: 'Checkout is unavailable.' });
  if (!validateAddress(req.body?.shippingAddress)) {
    return res.status(400).json({ error: 'Please provide a valid delivery address.' });
  }
  const paymentMethod = req.body?.paymentMethod;
  if (paymentMethod !== 'cod' && paymentMethod !== 'razorpay') {
    return res.status(400).json({ error: 'Unsupported payment method.' });
  }
  const requested = req.body?.items;
  if (!Array.isArray(requested) || requested.length < 1 || requested.length > 20) {
    return res.status(400).json({ error: 'Your cart is empty or contains too many line items.' });
  }
  if (paymentMethod === 'razorpay' && !razorpay) {
    return res.status(503).json({ error: 'Online payments are not configured.' });
  }

  const requestedItems: Array<{ productId: string; size: string; color: string; quantity: number }> = [];
  for (const item of requested) {
    if (!validText(item?.productId, 120) || !validText(item?.size, 10) ||
        !validText(item?.color, 80) || !Number.isSafeInteger(item?.quantity) ||
        item.quantity < 1 || item.quantity > 10) {
      return res.status(400).json({ error: 'One or more cart items are invalid.' });
    }
    requestedItems.push({
      productId: item.productId.trim(),
      size: item.size.trim(),
      color: item.color.trim(),
      quantity: item.quantity,
    });
  }
  const mergedItems = new Map<string, { productId: string; size: string; color: string; quantity: number }>();
  for (const item of requestedItems) {
    const key = [item.productId, item.size, item.color].join('::');
    const current = mergedItems.get(key);
    if (current) current.quantity += item.quantity;
    else mergedItems.set(key, { ...item });
  }
  const normalized = [...mergedItems.values()];
  if (normalized.some((item) => item.quantity > 10)) return res.status(400).json({ error: 'Maximum quantity per product variant is 10.' });
  if (paymentMethod === 'cod' && normalized.reduce((sum, item) => sum + item.quantity, 0) > 10) {
    return res.status(400).json({ error: 'Cash on Delivery is limited to 10 items per order.' });
  }

  const { db } = firebaseAdmin;
  const orderRef = db.collection('orders').doc();
  const publicOrderId = orderRef.id;
  const productIds = [...new Set(normalized.map((item) => item.productId))];
  const productRefs = productIds.map((productId) => db.collection('products').doc(productId));
  const requestedTotals = new Map<string, number>();
  for (const item of normalized) requestedTotals.set(item.productId, (requestedTotals.get(item.productId) || 0) + item.quantity);
  let orderData: any;

  try {
    await db.runTransaction(async (tx) => {
      const snapshots = await Promise.all(productRefs.map((ref) => tx.get(ref)));
      const productById = new Map(snapshots.map((snap) => [snap.id, snap]));
      for (const snap of snapshots) {
        if (!snap.exists) throw new Error('A product in your cart is no longer available.');
        const product = snap.data()!;
        const stock = Number(product.stock);
        const price = Number(product.price);
        const requestedQuantity = requestedTotals.get(snap.id) || 0;
        if (!Number.isFinite(price) || price <= 0 || !Number.isSafeInteger(stock) || stock < requestedQuantity) {
          throw new Error('Insufficient stock or invalid product price for ' + String(product.name || 'a product') + '.');
        }
      }
      const items: PricedItem[] = normalized.map((requestedItem) => {
        const snap = productById.get(requestedItem.productId)!;
        const product = snap.data()!;
        const sizes = Array.isArray(product.sizes) ? product.sizes : [];
        const colors = Array.isArray(product.colors) ? product.colors : [];
        if (!sizes.includes(requestedItem.size) ||
            !colors.some((color: any) => color?.name === requestedItem.color)) {
          throw new Error('The selected size or color is unavailable for ' + String(product.name || 'a product') + '.');
        }
        return {
          productId: snap.id,
          name: String(product.name || 'SNAPSTER Product'),
          price: Number(product.price),
          image: typeof product.image === 'string' ? product.image : '',
          size: requestedItem.size,
          color: requestedItem.color,
          quantity: requestedItem.quantity,
        };
      });

      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const promoCode = typeof req.body?.promoCode === 'string' ? req.body.promoCode.trim().toUpperCase() : '';
      const discount = promoCode === 'EDGE20'
        ? Math.round(subtotal * 0.2)
        : (promoCode === 'EDGE10' || promoCode === 'SNAP10')
          ? Math.round(subtotal * 0.1)
          : 0;
      const freeShippingPromo = promoCode === 'FREESHIP';
      if (promoCode && !['EDGE20', 'EDGE10', 'SNAP10', 'FREESHIP'].includes(promoCode)) {
        throw new Error('This promo code is invalid.');
      }
      const shipping = subtotal - discount >= 2499 || freeShippingPromo ? 0 : 149;
      const total = subtotal - discount + shipping;
      if (!Number.isSafeInteger(Math.round(total * 100)) || total <= 0) throw new Error('Order total is invalid.');
      if (paymentMethod === 'cod' && total > 50000) throw new Error('Cash on Delivery is unavailable for orders above ₹50,000.');

      // All product reads happen before writes, so stock changes are atomic.
      for (let i = 0; i < productRefs.length; i++) {
        const productId = productIds[i];
        tx.update(productRefs[i], {
          stock: Number(snapshots[i].data()!.stock) - (requestedTotals.get(productId) || 0),
          updatedAt: new Date().toISOString(),
        });
      }

      const userRecord = await firebaseAdmin!.auth.getUser((req as RequestWithRawBody).user!.uid);
      orderData = {
        id: publicOrderId,
        userId: (req as RequestWithRawBody).user!.uid,
        customerName: req.body.shippingAddress.fullName.trim(),
        customerEmail: userRecord.email || '',
        customerPhone: req.body.shippingAddress.phone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items,
        subtotal,
        discount,
        shipping,
        total,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay',
        paymentStatus: paymentMethod === 'cod' ? 'COD Pending' : 'Pending',
        shippingAddress: {
          fullName: req.body.shippingAddress.fullName.trim(),
          phone: req.body.shippingAddress.phone.trim(),
          street: req.body.shippingAddress.street.trim(),
          city: req.body.shippingAddress.city.trim(),
          state: req.body.shippingAddress.state.trim(),
          pincode: req.body.shippingAddress.pincode,
        },
        status: paymentMethod === 'cod' ? 'Confirmed' : 'Processing',
        awbNumber: '',
        estimatedDelivery: '',
      };
      tx.create(orderRef, orderData);
    });

    if (paymentMethod === 'cod') {
      return res.status(201).json({ order: orderData });
    }

    try {
      const gatewayOrder = await razorpay!.orders.create({
        amount: Math.round(orderData.total * 100),
        currency: 'INR',
        receipt: orderRef.id.slice(0, 40),
        notes: { snapsterOrderId: orderRef.id, customerUid: (req as RequestWithRawBody).user!.uid },
      });
      await orderRef.update({ razorpayOrderId: gatewayOrder.id, updatedAt: new Date().toISOString() });
      orderData.razorpayOrderId = gatewayOrder.id;
      return res.status(201).json({
        order: orderData,
        razorpay: { id: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency, keyId },
      });
    } catch (gatewayError) {
      // Release the reserved stock if Razorpay order creation failed.
      await db.runTransaction(async (tx) => {
        const current = await tx.get(orderRef);
        if (!current.exists || current.data()?.paymentStatus !== 'Pending') return;
        const productSnaps = await Promise.all(productRefs.map((ref) => tx.get(ref)));
        for (let i = 0; i < productRefs.length; i++) {
          if (productSnaps[i].exists) {
            const productId = productIds[i];
            tx.update(productRefs[i], {
              stock: Number(productSnaps[i].data()!.stock) + (requestedTotals.get(productId) || 0),
              updatedAt: new Date().toISOString(),
            });
          }
        }
        tx.delete(orderRef);
      });
      throw gatewayError;
    }
  } catch (error: any) {
    console.error('[Orders] create failed:', error);
    const message = error instanceof Error ? error.message : 'Unable to create order.';
    return res.status(400).json({ error: message });
  }
});

const ALLOWED_ORDER_STATUSES = new Set([
  'Confirmed', 'Processing', 'Packed at Hub', 'Shipped',
  'Out for Delivery', 'Delivered', 'Cancelled',
]);

app.patch('/api/admin/orders/:orderId/status', requireUser, requireAdmin, async (req: Request, res: Response) => {
  if (!firebaseAdmin) return res.status(503).json({ error: 'Database unavailable.' });
  const orderId = req.params.orderId;
  const status = req.body?.status;
  if (!validText(orderId, 150) || !ALLOWED_ORDER_STATUSES.has(status)) {
    return res.status(400).json({ error: 'Invalid order ID or status.' });
  }
  try {
    const ref = firebaseAdmin.db.collection('orders').doc(orderId);
    await firebaseAdmin.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists) throw new Error('ORDER_NOT_FOUND');
      const order = snap.data()!;
      if (order.status === 'Delivered' || order.status === 'Cancelled') {
        throw new Error('ORDER_FINAL_STATE');
      }
      if (status === 'Delivered' && order.paymentMethod !== 'Cash on Delivery' &&
          order.paymentStatus !== 'Paid') {
        throw new Error('UNPAID_ORDER');
      }

      // A cancelled COD order has no payment to refund, so release its stock
      // in the same transaction as the status change. Paid online orders need
      // a confirmed refund workflow before stock is released.
      if (status === 'Cancelled' && order.paymentMethod === 'Cash on Delivery') {
        const items = Array.isArray(order.items) ? order.items : [];
        const quantities = new Map<string, number>();
        for (const item of items) {
          const productId = String(item.productId || '');
          const quantity = Number(item.quantity);
          if (productId && Number.isSafeInteger(quantity) && quantity > 0) {
            quantities.set(productId, (quantities.get(productId) || 0) + quantity);
          }
        }
        const productIds = [...quantities.keys()];
        const refs = productIds.map((productId) => firebaseAdmin!.db.collection('products').doc(productId));
        const productSnaps = await Promise.all(refs.map((productRef) => tx.get(productRef)));
        for (let i = 0; i < refs.length; i++) {
          if (productSnaps[i].exists) {
            const stock = Number(productSnaps[i].data()?.stock);
            if (!Number.isSafeInteger(stock)) throw new Error('INVALID_PRODUCT_STOCK');
            tx.update(refs[i], {
              stock: stock + (quantities.get(productIds[i]) || 0),
              updatedAt: new Date().toISOString(),
            });
          }
        }
      }
      tx.update(ref, { status, updatedAt: new Date().toISOString() });
    });
    return res.json({ success: true, orderId, status });
  } catch (error) {
    console.error('[Admin] Order status update failed:', error);
    const message = error instanceof Error ? error.message : '';
    if (message === 'ORDER_NOT_FOUND') return res.status(404).json({ error: 'Order not found.' });
    if (message === 'ORDER_FINAL_STATE') return res.status(409).json({ error: 'This order is already in a final state.' });
    if (message === 'UNPAID_ORDER') return res.status(409).json({ error: 'An unpaid online order cannot be marked delivered.' });
    return res.status(500).json({ error: 'Could not update order status.' });
  }
});

app.post('/api/razorpay/verify-payment', requireUser, async (req: Request, res: Response) => {
  if (!firebaseAdmin || !razorpay || !keySecret) {
    return res.status(503).json({ verified: false, error: 'Payment verification is not configured.' });
  }
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
  if (![orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature].every((v) => typeof v === 'string' && v.length > 0)) {
    return res.status(400).json({ verified: false, error: 'Missing payment verification details.' });
  }

  try {
    const orderRef = firebaseAdmin.db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    if (!orderSnap.exists || orderSnap.data()?.userId !== (req as RequestWithRawBody).user!.uid) {
      return res.status(404).json({ verified: false, error: 'Order not found.' });
    }
    if (orderSnap.data()?.razorpayOrderId !== razorpay_order_id) {
      return res.status(400).json({ verified: false, error: 'Payment does not belong to this order.' });
    }

    const expectedSignature = crypto.createHmac('sha256', keySecret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (!safeHexEqual(razorpay_signature, expectedSignature)) {
      return res.status(400).json({ verified: false, error: 'Invalid Razorpay signature.' });
    }

    const payment: any = await razorpay.payments.fetch(razorpay_payment_id);
    const result = await markPaymentCaptured(payment) as Record<string, any>;
    if (result.userId !== (req as RequestWithRawBody).user!.uid) {
      return res.status(403).json({ verified: false, error: 'Payment owner mismatch.' });
    }
    return res.json({ verified: true, order: result, paymentId: payment.id, razorpayOrderId: payment.order_id });
  } catch (error: any) {
    console.error('[Razorpay] verification failed:', error);
    return res.status(400).json({ verified: false, error: error?.message || 'Payment could not be verified.' });
  }
});

async function releaseReservedStock(orderRef: DocumentReference, failureReason: string) {
  if (!firebaseAdmin) throw new Error('Firebase Admin is unavailable.');
  const { db } = firebaseAdmin;
  await db.runTransaction(async (tx) => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) return;
    const order = orderSnap.data()!;
    if (order.paymentStatus !== 'Pending') return;
    const items = Array.isArray(order.items) ? order.items : [];
    const quantities = new Map<string, number>();
    for (const item of items) {
      const productId = String(item.productId || '');
      const quantity = Number(item.quantity);
      if (productId && Number.isSafeInteger(quantity) && quantity > 0) {
        quantities.set(productId, (quantities.get(productId) || 0) + quantity);
      }
    }
    const productIds = [...quantities.keys()];
    const refs = productIds.map((productId) => db.collection('products').doc(productId));
    const productSnaps = await Promise.all(refs.map((ref) => tx.get(ref)));
    for (let i = 0; i < refs.length; i++) {
      if (productSnaps[i].exists) {
        const stock = Number(productSnaps[i].data()?.stock);
        if (Number.isSafeInteger(stock)) {
          tx.update(refs[i], {
            stock: stock + (quantities.get(productIds[i]) || 0),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    }
    tx.update(orderRef, {
      paymentStatus: 'Failed',
      status: 'Cancelled',
      updatedAt: new Date().toISOString(),
      paymentFailureReason: failureReason.slice(0, 160),
    });
  });
}

// Configure an external scheduler to call this endpoint every 5 minutes.
// Pending Razorpay reservations older than 20 minutes are released safely.
app.post('/api/maintenance/expire-pending-orders', async (req: Request, res: Response) => {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers['x-cron-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  if (!firebaseAdmin) return res.status(503).json({ error: 'Database unavailable.' });
  const cutoff = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const pending = await firebaseAdmin.db.collection('orders')
    .where('paymentStatus', '==', 'Pending')
    .where('createdAt', '<=', cutoff)
    .limit(100)
    .get();
  let released = 0;
  for (const docSnap of pending.docs) {
    await releaseReservedStock(docSnap.ref, 'Payment reservation expired.');
    released++;
  }
  return res.json({ checked: pending.size, released });
});

app.post('/api/razorpay/webhook', async (req: Request, res: Response) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = (req as RequestWithRawBody).rawBody;
  if (!webhookSecret || typeof signature !== 'string' || !rawBody) {
    return res.status(503).send('Webhook verification is not configured.');
  }
  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  if (!safeHexEqual(signature, expected)) return res.status(400).send('Invalid webhook signature.');

  try {
    if (req.body?.event === 'payment.captured') {
      await markPaymentCaptured(req.body.payload?.payment?.entity);
    } else if (req.body?.event === 'payment.failed') {
      // A Razorpay order can have multiple payment attempts. One failed attempt
      // must not cancel the SNAPSTER order or release its reserved stock because
      // the customer may retry and a later attempt may be captured successfully.
      // The reservation is released by the expiry job after the retry window.
      const failedPayment = req.body.payload?.payment?.entity;
      console.info('[Razorpay Webhook] Payment attempt failed:', {
        paymentId: failedPayment?.id,
        gatewayOrderId: failedPayment?.order_id,
      });
    }
    return res.json({ status: 'ok', received: true });
  } catch (error) {
    console.error('[Razorpay Webhook] Processing failed:', error);
    return res.status(500).send('Webhook processing failed. Razorpay may retry this event.');
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }
  app.listen(PORT, () => {
    console.log(`[SNAPSTER] Server active on port ${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exitCode = 1;
});
