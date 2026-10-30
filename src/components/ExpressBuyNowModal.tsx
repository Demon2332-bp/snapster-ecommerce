import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, Banknote, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { openRazorpayCheckout, createSecureOrder } from '../services/razorpay';

type CheckoutAddress = {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
};

export const ExpressBuyNowModal: React.FC = () => {
  const {
    buyNowData,
    setBuyNowData,
    formatPrice,
    showToast,
    user,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ orderId: string; total: number; paymentStatus: string } | null>(null);
  const [address, setAddress] = useState<CheckoutAddress>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
  });

  useEffect(() => {
    const savedAddress = user?.addresses?.find((item) => item.isDefault) || user?.addresses?.[0];
    setAddress({
      name: savedAddress?.fullName || user?.name || '',
      phone: savedAddress?.phone || user?.phone || '',
      street: savedAddress?.street || '',
      city: savedAddress?.city || '',
      state: savedAddress?.state || '',
    });
    setPincode(savedAddress?.pincode || '');
  }, [user, buyNowData]);

  if (!buyNowData) return null;

  const product = buyNowData.product;
  const unitPrice = product.price;
  const estimatedSubtotal = unitPrice * quantity;
  const maxQuantity = Math.max(1, Math.min(Number(product.stock) || 1, 10));

  const updateAddress = (field: keyof CheckoutAddress, value: string) => {
    setAddress((current) => ({ ...current, [field]: value }));
  };

  const handlePlaceOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user?.id) {
      showToast('Please sign in before placing an order.', 'error');
      return;
    }
    if (!user.email) {
      showToast('Add an email address to your account before checkout.', 'error');
      return;
    }
    if (!address.name.trim() || !address.street.trim() || !address.city.trim() ||
        !address.state.trim() || !/^[0-9]{6}$/.test(pincode) ||
        !/^[0-9+()\-\s]{10,20}$/.test(address.phone.trim())) {
      showToast('Please enter a valid name, 10-digit phone number, complete address and 6-digit PIN code.', 'error');
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) {
      showToast('Please select a valid quantity.', 'error');
      return;
    }

    const shippingAddress = {
      fullName: address.name.trim(),
      phone: address.phone.trim(),
      street: address.street.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      pincode,
    };
    const items = [{
      productId: product.id,
      name: product.name,
      price: unitPrice,
      image: product.image,
      size: buyNowData.size,
      color: buyNowData.color,
      quantity,
    }];

    setIsProcessing(true);
    if (paymentMethod === 'cod') {
      try {
        const created = await createSecureOrder({
          items: items.map(({ productId, size, color, quantity: itemQuantity }) => ({
            productId, size, color, quantity: itemQuantity,
          })),
          shippingAddress,
          paymentMethod: 'cod',
        });
        setOrderConfirmed({
          orderId: created.id,
          total: Number(created.total),
          paymentStatus: created.paymentStatus,
        });
        showToast(`Order ${created.id} placed. Payment is due on delivery.`, 'success');
      } catch (error: any) {
        showToast(error?.message || 'Could not place your order. Please try again.', 'error');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    await openRazorpayCheckout({
      items,
      shippingAddress,
      customerName: address.name.trim(),
      customerEmail: user.email,
      customerPhone: address.phone.trim(),
      onSuccess: ({ paymentId, order: confirmedOrder }) => {
        setIsProcessing(false);
        setOrderConfirmed({
          orderId: confirmedOrder.id,
          total: Number(confirmedOrder.total),
          paymentStatus: confirmedOrder.paymentStatus,
        });
        showToast(`Payment ${paymentId} verified. Order ${confirmedOrder.id} confirmed.`, 'success');
      },
      onFailure: (message) => {
        setIsProcessing(false);
        showToast(`Payment could not be completed: ${message}`, 'error');
      },
    });
  };

  const handleClose = () => {
    if (isProcessing) return;
    setBuyNowData(null);
    setOrderConfirmed(null);
    setQuantity(1);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Express checkout"
    >
      <div
        className="relative w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-4 bg-[#4A0718] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black text-[10px] font-black font-mono px-2 py-0.5 uppercase tracking-wider">
              EXPRESS BUY NOW
            </span>
            <span className="text-xs font-mono text-white/80 hidden sm:inline">Secure checkout</span>
          </div>
          <button onClick={handleClose} disabled={isProcessing} className="p-1 text-white hover:opacity-75 disabled:opacity-40" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {orderConfirmed ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block tracking-wider">
                  {orderConfirmed.paymentStatus === 'Paid' ? 'Payment confirmed' : 'Order placed'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase font-headline text-white mt-1 break-all">
                  ORDER ID: {orderConfirmed.orderId}
                </h2>
                <p className="text-xs sm:text-sm text-[#C7BDB7] mt-2 max-w-md mx-auto">
                  We will show shipment and tracking details here after your order is actually dispatched by a delivery partner.
                </p>
              </div>
              <div className="max-w-md mx-auto bg-[#221F22] border border-white/15 p-4 text-left font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Order total</span>
                  <span className="text-white font-bold text-sm">{formatPrice(orderConfirmed.total)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Payment status</span>
                  <span className="text-emerald-400 font-bold">{orderConfirmed.paymentStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C7BDB7]">Delivering to</span>
                  <span className="text-white text-right max-w-[65%]">{address.street}, {address.city} - {pincode}</span>
                </div>
              </div>
              <button onClick={handleClose} className="px-8 py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors">
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="flex gap-4 p-3.5 bg-white/5 border border-white/10">
                <img src={product.image} alt={product.name} className="w-20 h-24 object-cover shrink-0 border border-white/10" />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#C7BDB7]">
                      <span>Size: <strong className="text-white">{buyNowData.size}</strong></span>
                      <span>·</span>
                      <span>Color: <strong className="text-white">{buyNowData.color}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center border border-white/20 bg-black/40">
                      <button type="button" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="w-7 h-7 text-white hover:bg-white/10" aria-label="Decrease quantity">-</button>
                      <span className="w-8 text-center font-mono text-xs font-bold">{quantity}</span>
                      <button type="button" onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))} className="w-7 h-7 text-white hover:bg-white/10" aria-label="Increase quantity" disabled={quantity >= maxQuantity}>+</button>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">{formatPrice(estimatedSubtotal)}</div>
                      <div className="text-[10px] text-[#C7BDB7]">Estimated item subtotal</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#C7BDB7] font-bold">
                  <MapPin size={14} /> Delivery address
                </div>
                <p className="text-[11px] text-[#C7BDB7]">Use a saved address or enter the correct delivery details. Nothing is prefilled with a sample address.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    ['name', 'Full name'],
                    ['phone', 'Mobile number'],
                    ['street', 'House / street / area'],
                    ['city', 'City'],
                    ['state', 'State'],
                  ] as [keyof CheckoutAddress, string][]).map(([field, label]) => (
                    <label key={field} className={field === 'street' ? 'sm:col-span-2 space-y-1' : 'space-y-1'}>
                      <span className="text-[11px] text-[#C7BDB7]">{label}</span>
                      <input
                        required
                        type="text"
                        autoComplete={field === 'name' ? 'name' : field === 'phone' ? 'tel' : 'street-address'}
                        value={address[field]}
                        onChange={(event) => updateAddress(field, event.target.value)}
                        maxLength={field === 'street' ? 250 : field === 'name' ? 100 : 80}
                        className="w-full bg-black/50 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                      />
                    </label>
                  ))}
                  <label className="space-y-1">
                    <span className="text-[11px] text-[#C7BDB7]">PIN code</span>
                    <input
                      required
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      value={pincode}
                      onChange={(event) => setPincode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-black/50 border border-white/20 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-mono uppercase text-[#C7BDB7] font-bold">Payment method</div>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPaymentMethod('razorpay')} className={`p-3 text-left border ${paymentMethod === 'razorpay' ? 'bg-[#4A0718] border-[#78132D] text-white' : 'bg-white/5 border-white/10 text-[#C7BDB7]'}`}>
                    <ShieldCheck size={17} />
                    <div className="text-xs font-bold uppercase mt-1">Online payment</div>
                    <div className="text-[10px] opacity-75">UPI, cards and net banking via Razorpay</div>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('cod')} className={`p-3 text-left border ${paymentMethod === 'cod' ? 'bg-[#4A0718] border-[#78132D] text-white' : 'bg-white/5 border-white/10 text-[#C7BDB7]'}`}>
                    <Banknote size={17} />
                    <div className="text-xs font-bold uppercase mt-1">Cash on delivery</div>
                    <div className="text-[10px] opacity-75">If available for this order</div>
                  </button>
                </div>
                {paymentMethod === 'razorpay' && (
                  <p className="text-[11px] text-[#C7BDB7]">UPI, card and net-banking details are entered only in Razorpay's secure checkout. SNAPSTER does not collect or store card numbers, expiry dates, CVV or UPI PINs.</p>
                )}
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/10 font-mono text-xs space-y-2">
                <div className="flex justify-between text-[#C7BDB7]">
                  <span>Estimated item subtotal</span>
                  <span className="text-white">{formatPrice(estimatedSubtotal)}</span>
                </div>
                <p className="text-[11px] text-[#C7BDB7]">Final price, discounts, shipping and stock availability are recalculated by SNAPSTER's server before the order is accepted.</p>
              </div>

              <button type="submit" disabled={isProcessing || !user || Number(product.stock) < 1} className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? <><Loader2 size={16} className="animate-spin" /><span>PROCESSING SECURE ORDER...</span></> : <><span>{user ? (paymentMethod === 'cod' ? 'PLACE COD ORDER' : 'CONTINUE TO SECURE PAYMENT') : 'SIGN IN TO CHECK OUT'}</span><ArrowRight size={16} /></>}
              </button>
              {!user && <p className="text-center text-[11px] text-amber-300">Please sign in and verify your email before checkout.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
