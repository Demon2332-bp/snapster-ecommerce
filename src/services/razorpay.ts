import { CustomerOrder } from '../types/store';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export interface RazorpayPaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  error?: string;
}

export interface RazorpayOptions {
  order: CustomerOrder;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  onSuccess: (paymentDetails: {
    paymentId: string;
    orderId?: string;
    signature?: string;
    method?: string;
  }) => void;
  onFailure: (errorMessage: string) => void;
}

/**
 * Uses a server-created Razorpay order and requires a positive server-side
 * signature verification response. No client-side or simulated payment fallback.
 */
export async function openRazorpayCheckout({
  order,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onFailure,
}: RazorpayOptions): Promise<void> {
  try {
    const orderRes = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: order.total,
        currency: 'INR',
        receipt: order.id,
        notes: { orderId: order.id },
      }),
    });

    const orderData = await orderRes.json().catch(() => ({}));
    if (!orderRes.ok || !orderData.id || !orderData.keyId || !Number.isFinite(Number(orderData.amount))) {
      throw new Error(orderData.error || 'The payment server could not create a valid Razorpay order.');
    }

    if (typeof window === 'undefined' || !window.Razorpay) {
      throw new Error('Razorpay Checkout is unavailable. Please refresh and try again.');
    }

    const options: any = {
      key: orderData.keyId,
      order_id: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'SNAPSTER APPAREL CO.',
      description: `Order #${order.id}`,
      prefill: {
        name: customerName,
        email: customerEmail || '',
        contact: customerPhone?.replace(/\D/g, '').slice(-10) || '',
      },
      notes: { orderId: order.id },
      theme: { color: '#4A0718' },
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json().catch(() => ({}));
          if (!verifyRes.ok || verifyData.verified !== true) {
            onFailure(verifyData.error || 'Payment could not be verified by the server.');
            return;
          }

          onSuccess({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            method: 'Razorpay',
          });
        } catch (error: any) {
          onFailure(error?.message || 'Unable to verify payment with the server. Do not retry payment until its status is checked.');
        }
      },
      modal: {
        ondismiss: () => onFailure('Payment was cancelled by user.'),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (res: any) => {
      onFailure(res.error?.description || 'Payment transaction failed or was declined.');
    });
    rzp.open();
  } catch (error: any) {
    onFailure(error?.message || 'Payment processing failed.');
  }
}
