import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { openRazorpayCheckout } from '../services/razorpay';
import { CustomerOrder } from '../types/store';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    cartSubtotal,
    discountAmount,
    shippingFee,
    showToast,
    formatPrice,
    currency,
    addOrder,
    getExpectedDeliveryDate,
    user,
  } = useStore();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [paidPaymentId, setPaidPaymentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '520010',
    paymentMethod: 'razorpay',
  });

  // Autofill from user profile if available
  useEffect(() => {
    if (user) {
      const defAddr = user.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone?.replace(/\D/g, '').slice(-10) || '',
        address: prev.address || defAddr?.street || '',
        city: prev.city || defAddr?.city || 'Vijayawada',
        state: prev.state || defAddr?.state || 'Andhra Pradesh',
        pincode: prev.pincode || defAddr?.pincode || '520010',
      }));
    }
  }, [user, isCheckoutOpen]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isCheckoutOpen) return null;

  const total = cartSubtotal - discountAmount + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = '10-digit phone number is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pincode.trim() || formData.pincode.length !== 6) errs.pincode = 'Valid 6-digit postal code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const generatedOrderNum = `SNP-${Math.floor(100000 + Math.random() * 900000)}`;
    const pendingOrder: CustomerOrder = {
      id: generatedOrderNum,
      userId: user?.id,
      customerName: formData.fullName,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      createdAt: new Date().toISOString(),
      items: cart.map((c) => ({
        productId: c.productId,
        name: c.name,
        price: c.price,
        image: c.image,
        size: c.size,
        color: c.color,
        quantity: c.quantity,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: total,
      paymentMethod: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay (UPI / Cards / NetBanking)',
      paymentStatus: formData.paymentMethod === 'cod' ? 'COD Pending' : 'Pending',
      shippingAddress: {
        fullName: formData.fullName,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      status: 'Confirmed',
      awbNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: getExpectedDeliveryDate(formData.pincode),
    };

    if (formData.paymentMethod === 'cod') {
      setIsProcessing(true);
      setTimeout(() => {
        addOrder(pendingOrder);
        setOrderNumber(generatedOrderNum);
        setPaidPaymentId(null);
        setIsProcessing(false);
        setStep('success');
        clearCart();
        showToast(`Order ${generatedOrderNum} placed via COD! Doorstep BlueDart delivery scheduled.`, 'success');
      }, 800);
      return;
    }

    // Razorpay Integration
    setIsProcessing(true);
    openRazorpayCheckout({
      order: pendingOrder,
      customerName: formData.fullName,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      onSuccess: ({ paymentId, orderId, signature, method }) => {
        pendingOrder.paymentStatus = 'Paid';
        pendingOrder.paymentId = paymentId;
        pendingOrder.razorpayOrderId = orderId;
        pendingOrder.razorpaySignature = signature;
        if (method) pendingOrder.paymentMethod = method;
        addOrder(pendingOrder);
        setOrderNumber(generatedOrderNum);
        setPaidPaymentId(paymentId);
        setIsProcessing(false);
        setStep('success');
        clearCart();
        showToast(`Payment Confirmed (${paymentId})! Order placed permanently in Firestore.`, 'success');
      },
      onFailure: (errMsg) => {
        setIsProcessing(false);
        showToast(`Payment could not be completed: ${errMsg}`, 'error');
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => setIsCheckoutOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#171617] text-[#F6F1E9] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#4A0718] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-white" />
            <h3 className="text-base font-black uppercase font-headline tracking-wider text-white">
              {step === 'details' ? 'SECURE CHECKOUT' : 'ORDER CONFIRMED'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep('details');
            }}
            className="p-1 text-white hover:opacity-75 cursor-pointer"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {step === 'success' ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-[#C7BDB7] tracking-widest block">
                  Payment Authorized · {currency}
                </span>
                <h2 className="text-3xl font-black uppercase font-headline text-white mt-1">
                  ORDER {orderNumber}
                </h2>
                <p className="text-xs sm:text-sm text-[#C7BDB7] mt-2 max-w-md mx-auto">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. A shipment confirmation and tracking link have been dispatched to <strong className="text-white">{formData.email}</strong>.
                </p>
              </div>

              {/* Order Status Stepper */}
              <div className="max-w-md mx-auto bg-black/40 border border-white/10 p-4">
                <span className="text-[10px] font-mono uppercase text-[#C7BDB7] block mb-3 text-left">
                  Fulfillment Status:
                </span>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">1. Confirmed ✓</span>
                  <span className="text-white">2. Packing</span>
                  <span className="text-[#C7BDB7]">3. In Transit</span>
                  <span className="text-[#C7BDB7]">4. Delivered</span>
                </div>
              </div>

              {/* Receipt Summary Card */}
              <div className="max-w-md mx-auto bg-white/5 border border-white/10 p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Delivery Address</span>
                  <span className="text-white text-right max-w-[200px] truncate">
                    {formData.address}, {formData.city} - {formData.pincode}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Payment Method</span>
                  <span className="text-white uppercase font-bold">{formData.paymentMethod}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Estimated Delivery</span>
                  <span className="text-emerald-400 font-bold">2–4 Business Days</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-white">Amount Paid</span>
                  <span className="text-white">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setStep('details');
                  }}
                  className="px-8 py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xl"
                >
                  RETURN TO STORE
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Order Items Preview */}
              <div className="bg-white/5 border border-white/10 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#C7BDB7] pb-2 border-b border-white/10">
                  <span>Cart Items ({cart.length})</span>
                  <span>Total: {formatPrice(total)}</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto py-1 no-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 shrink-0 bg-black/40 p-1.5 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-10 h-12 object-cover" />
                      <div className="text-[11px] font-mono">
                        <div className="text-white font-bold max-w-[120px] truncate">{item.name}</div>
                        <div className="text-[#C7BDB7]">{item.size} · Qty {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                  1. Shipping Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Yashvardhan Singhania"
                      className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                    {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
                    />
                    {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yash@example.com"
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                  {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                    Street Address & Apartment *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Flat 402, Highline Towers, Senapati Bapat Marg"
                    className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                  {errors.address && <p className="text-[10px] text-red-400 mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Vijayawada"
                      className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                    />
                    {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      State / Region *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#1A181A] border border-white/15 px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="Andhra Pradesh">Andhra Pradesh (Home Hub)</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi NCR</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Other">All Other States</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-[#C7BDB7] uppercase block mb-1">
                      Postal / PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400013"
                      className="w-full bg-white/5 border border-white/15 px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
                    />
                    {errors.pincode && <p className="text-[10px] text-red-400 mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2">
                  2. Select Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'razorpay', name: 'Razorpay Secure Payment', desc: 'UPI (GPay, PhonePe, Paytm, QR), Cards, Net Banking', icon: CreditCard, badge: 'RECOMMENDED' },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay cash upon doorstep delivery in Vijayawada & AP', icon: Banknote, badge: 'VERIFIED' },
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = formData.paymentMethod === method.id;
                    return (
                      <label
                        key={method.id}
                        className={`p-4 border cursor-pointer flex flex-col justify-between transition-colors ${
                          isSelected
                            ? 'bg-[#4A0718]/40 border-amber-400 text-white shadow-md'
                            : 'bg-white/5 border-white/10 text-[#C7BDB7] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Icon size={18} className={isSelected ? 'text-amber-400' : 'text-[#C7BDB7]'} />
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-white/10 text-white">
                              {method.badge}
                            </span>
                          </div>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={isSelected}
                            onChange={handleInputChange}
                            className="accent-amber-400 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white uppercase">{method.name}</div>
                          <div className="text-[10px] text-[#C7BDB7] mt-1">{method.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-2xl cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>AUTHORIZING PAYMENT...</span>
                    </>
                  ) : (
                    <>
                      <span>PAY {formatPrice(total)} & PLACE ORDER</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
