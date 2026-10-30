import { auth } from './firebase';
import { CustomerOrder } from '../types/store';

declare global {
  interface Window { Razorpay?: any; }
}

export interface SecureOrderInput {
  items: Array<{ productId: string; size: string; color: string; quantity: number }>;
  shippingAddress: CustomerOrder['shippingAddress'];
  paymentMethod: 'cod' | 'razorpay';
  customerName?: string;
  promoCode?: string | null;
}

async function authenticatedPost(path: string, body: unknown) {
  const user = auth.currentUser;
  if (!user) throw new Error('Please sign in before placing an order.');
  const token = await user.getIdToken();
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'The secure checkout request failed.');
  return data;
}

export async function createSecureOrder(input: SecureOrderInput): Promise<CustomerOrder> {
  const data = await authenticatedPost('/api/orders', input);
  if (!data.order?.id) throw new Error('The server did not return a valid order.');
  return data.order as CustomerOrder;
}

export interface RazorpayOptions {
  order: CustomerOrder;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  promoCode?: string | null;
  onSuccess: (details: { paymentId: string; orderId: string; signature: string; method: string; order: CustomerOrder }) => void;
  onFailure: (message: string) => void;
}

/**
 * The browser never supplies an amount. The authenticated server loads product
 * prices, reserves inventory and creates the Razorpay order.
 */
export async function openRazorpayCheckout({
  order, customerName, customerEmail, customerPhone, promoCode, onSuccess, onFailure,
}: RazorpayOptions): Promise<void> {
  try {
    if (typeof window === 'undefined' || !window.Razorpay) {
      throw new Error('Razorpay Checkout is unavailable. Please refresh and try again.');
    }

    const created = await authenticatedPost('/api/orders', {
      items: order.items.map((item) => ({
        productId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
      shippingAddress: order.shippingAddress,
      paymentMethod: 'razorpay',
      customerName,
      promoCode: promoCode || undefined,
    });

    const serverOrder = created.order as CustomerOrder;
    const gatewayOrder = created.razorpay;
    if (!serverOrder?.id || !gatewayOrder?.id || !gatewayOrder?.keyId || !Number.isSafeInteger(gatewayOrder.amount)) {
      throw new Error('The payment server returned an invalid order.');
    }

    const options: any = {
      key: gatewayOrder.keyId,
      order_id: gatewayOrder.id,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency || 'INR',
      name: 'SNAPSTER APPAREL CO.',
      description: `Order #${serverOrder.id}`,
      prefill: {
        name: customerName,
        email: customerEmail || '',
        contact: customerPhone?.replace(/\D/g, '').slice(-10) || '',
      },
      notes: { snapsterOrderId: serverOrder.id },
      theme: { color: '#4A0718' },
      handler: async (response: any) => {
        try {
          const verified = await authenticatedPost('/api/razorpay/verify-payment', {
            orderId: serverOrder.id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (verified.verified !== true || !verified.order || verified.order.paymentStatus !== 'Paid') {
            throw new Error('The server has not confirmed this payment as captured.');
          }
          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'Razorpay',
            order: verified.order as CustomerOrder,
          });
        } catch (error: any) {
          onFailure(error?.message || 'Payment status could not be confirmed. Contact support before retrying.');
        }
      },
      modal: { ondismiss: () => onFailure('Payment window closed. Check your order status before retrying.') },
    };

    const checkout = new window.Razorpay(options);
    checkout.on('payment.failed', (event: any) => {
      onFailure(event?.error?.description || 'Payment failed. Any reserved stock will be reviewed.');
    });
    checkout.open();
  } catch (error: any) {
    onFailure(error?.message || 'Secure checkout could not be started.');
  }
}
