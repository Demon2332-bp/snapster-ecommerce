import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Smartphone, Banknote, ArrowRight, Loader2, MapPin, Sparkles, Tag, Landmark, QrCode } from 'lucide-react';
import { useStore, BuyNowData } from '../context/StoreContext';
import { openRazorpayCheckout, createSecureOrder } from '../services/razorpay';
import { CustomerOrder } from '../types/store';

export const ExpressBuyNowModal: React.FC = () => {
  const {
    buyNowData,
    setBuyNowData,
    formatPrice,
    getExpectedDeliveryDate,
    showToast,
    user,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('520010');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('santhi@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8921');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<{ orderId: string; deliveryDate: string; paymentId?: string } | null>(null);

  const [address, setAddress] = useState({
    name: 'Santhi Raju',
    phone: '9820048192',
    street: 'Door No. 40-1-62, MG Road, Labbipet',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
  });

  useEffect(() => {
    if (user) {
      const defAddr = user.addresses?.[0];
      setAddress((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone?.replace(/\D/g, '').slice(-10) || prev.phone,
        street: defAddr?.street || prev.street,
        city: defAddr?.city || prev.city,
        state: defAddr?.state || prev.state,
      }));
      if (defAddr?.pincode) {
        setPincode(defAddr.pincode);
      }
    }
  }, [user, buyNowData]);

  if (!buyNowData) return null;

  const product = buyNowData.product;
  const unitPrice = product.price;
  const originalUnitPrice = product.originalPrice || Math.round(product.price * 1.25);
  const totalOriginal = originalUnitPrice * quantity;
  const totalPayable = unitPrice * quantity;
  const totalSavings = totalOriginal - totalPayable;
  const deliveryDate = getExpectedDeliveryDate(pincode);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `SNP-${Math.floor(100000 + Math.random() * 900000)}`;

    const pendingOrder: CustomerOrder = {
      id: orderId,
      userId: user?.id,
      customerName: address.name,
      customerPhone: address.phone,
      customerEmail: user?.email,
      createdAt: new Date().toISOString(),
      items: [
        {
          productId: product.id,
          name: product.name,
          price: unitPrice,
          image: product.image,
          size: buyNowData.size,
          color: buyNowData.color,
          quantity: quantity,
        },
      ],
      subtotal: totalPayable,
      discount: totalSavings,
      shipping: 0,
      total: totalPayable,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay (UPI / Cards / NetBanking)',
      paymentStatus: paymentMethod === 'cod' ? 'COD Pending' : 'Pending',
      shippingAddress: {
        fullName: address.name,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: pincode,
      },
      status: 'Confirmed',
      awbNumber: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: deliveryDate,
    };

    if (paymentMethod === 'cod') {
      setIsProcessing(true);
      try {
        const created = await createSecureOrder({
          items: pendingOrder.items.map((item) => ({
            productId: item.productId, size: item.size, color: item.color, quantity: item.quantity,
          })),
          shippingAddress: pendingOrder.shippingAddress,
          paymentMethod: 'cod',
          customerName: address.name,
        });
        setIsProcessing(false);
        setOrderConfirmed({ orderId: created.id, deliveryDate });
        showToast(`Order ${created.id} placed successfully. Payment is due on delivery.`, 'success');
      } catch (error: any) {
        setIsProcessing(false);
        showToast(error?.message || 'Could not place your order. Please sign in and try again.', 'error');
      }
      return;
    }

    // Razorpay checkout
    setIsProcessing(true);
    openRazorpayCheckout({
      order: pendingOrder,
      customerName: address.name,
      customerEmail: user?.email || 'customer@snapster.in',
      customerPhone: address.phone,
      onSuccess: ({ paymentId, orderId: rzpOrderId, signature, method, order: confirmedOrder }) => {
        pendingOrder.paymentStatus = 'Paid';
        pendingOrder.paymentId = paymentId;
        pendingOrder.razorpayOrderId = rzpOrderId;
        pendingOrder.razorpaySignature = signature;
        if (method) pendingOrder.paymentMethod = method;
        setIsProcessing(false);
        setOrderConfirmed({
          orderId: confirmedOrder.id,
          deliveryDate,
          paymentId,
        });
        showToast(`Payment captured and order ${confirmedOrder.id} confirmed by the server.`, 'success');
      },
      onFailure: (errMsg) => {
        setIsProcessing(false);
        showToast(`Payment could not be completed: ${errMsg}`, 'error');
      },
    });
  };

  const handleClose = () => {
    setBuyNowData(null);
    setOrderConfirmed(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Flipkart / Luxury Streetwear Style Header */}
        <div className="p-4 bg-[#4A0718] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black text-[10px] font-black font-mono px-2 py-0.5 uppercase tracking-wider">
              EXPRESS BUY NOW
            </span>
            <span className="text-xs font-mono text-white/80 hidden sm:inline">
              1-Click Instant Checkout
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1 text-white hover:opacity-75 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {orderConfirmed ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold block tracking-wider">
                  Order Successfully Placed
                </span>
                <h2 className="text-3xl font-black uppercase font-headline text-white mt-1">
                  ORDER ID: {orderConfirmed.orderId}
                </h2>
                <p className="text-xs sm:text-sm text-[#C7BDB7] mt-2 max-w-md mx-auto">
                  BlueDart Express AWB generated. Dispatched from Vijayawada Central Distribution Center (Andhra Pradesh).
                </p>
              </div>

              {/* Delivery ETA Card */}
              <div className="max-w-md mx-auto bg-[#221F22] border border-white/15 p-4 text-left font-mono text-xs space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Guaranteed Delivery</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {orderConfirmed.deliveryDate}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Item & Quantity</span>
                  <span className="text-white font-bold truncate max-w-[200px]">
                    {product.name} (Size {buyNowData.size}) × {quantity}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[#C7BDB7]">Delivery Address</span>
                  <span className="text-white truncate max-w-[200px]">
                    {address.street}, {address.city} - {pincode}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[#C7BDB7]">Total Paid</span>
                  <span className="text-white font-bold text-sm">
                    {formatPrice(totalPayable)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="px-8 py-3.5 bg-white text-[#111011] hover:bg-[#F6F1E9] font-black text-xs uppercase tracking-widest transition-colors cursor-pointer shadow-xl"
              >
                CONTINUE SHOPPING
              </button>
            </div>
          ) : (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* Product Card with Quantity Selector */}
              <div className="flex gap-4 p-3.5 bg-white/5 border border-white/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover shrink-0 border border-white/10"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{product.name}</h4>
                    <div className="flex items-center gap-2 mt-1 text-xs font-mono text-[#C7BDB7]">
                      <span>Size: <strong className="text-white">{buyNowData.size}</strong></span>
                      <span>·</span>
                      <span>Color: <strong className="text-white">{buyNowData.color}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-white/20 bg-black/40">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 text-xs cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono text-xs font-bold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 text-xs cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-white">
                        {formatPrice(totalPayable)}
                      </div>
                      <div className="text-[11px] text-[#C7BDB7] line-through">
                        {formatPrice(totalOriginal)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Date & PIN code Checker Bar (Flipkart Style) */}
              <div className="p-3.5 bg-[#201D20] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5">
                  <Truck size={18} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-white font-bold">
                      Delivery by <span className="text-emerald-400 font-extrabold">{deliveryDate}</span>
                    </div>
                    <div className="text-[11px] text-[#C7BDB7]">
                      FREE Express Shipping · Order within 4 hrs
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto">
                  <MapPin size={13} className="text-[#C7BDB7]" />
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="PIN Code"
                    className="w-24 bg-black/50 border border-white/20 px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-emerald-400 uppercase font-bold">Verified</span>
                </div>
              </div>

              {/* Delivery Address Snapshot */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase text-[#C7BDB7] font-bold">Delivering To:</span>
                  <span className="text-emerald-400 font-bold">{address.name} ({address.phone})</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 text-xs font-mono text-[#C7BDB7]">
                  {address.street}, {address.city}, {address.state} - {pincode}
                </div>
              </div>

              {/* Payment Methods Options inside Buy Now (Flipkart Style) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="uppercase text-[#C7BDB7] font-bold">
                    Select Payment Method:
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>100% Encrypted</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upi', name: 'Instant UPI', desc: 'GPay / PhonePe / QR', icon: Smartphone },
                    { id: 'card', name: 'Credit/Debit Card', desc: 'Visa, Master, RuPay', icon: CreditCard },
                    { id: 'netbanking', name: 'Net Banking', desc: 'All Major Banks', icon: Landmark },
                    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at Doorstep', icon: Banknote },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-2.5 text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#4A0718] border-[#78132D] text-white ring-1 ring-white/20'
                            : 'bg-white/5 border-white/10 text-[#C7BDB7] hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <Icon size={16} className={isSelected ? 'text-white' : 'text-[#C7BDB7]'} />
                        <div className="text-xs font-bold uppercase mt-1 text-white">{m.name}</div>
                        <div className="text-[10px] opacity-75">{m.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Contextual Payment Form based on selected method */}
                <div className="p-3 bg-white/5 border border-white/10 font-mono text-xs space-y-2.5">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#C7BDB7]">
                        <span>Enter UPI Virtual Address / VPA:</span>
                        <span className="text-emerald-400 font-bold">Fastest Checkout</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="flex-1 bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                        />
                        <button
                          type="button"
                          onClick={() => showToast('UPI Address verified with NPCI', 'success')}
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                      <p className="text-[10px] text-[#C7BDB7]/80">
                        A payment collect request will be sent to your UPI App (Google Pay, PhonePe, Paytm).
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-2.5">
                      <div className="text-[11px] text-[#C7BDB7]">Enter Card Details:</div>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-white"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="CVV"
                          maxLength={3}
                          className="bg-black/60 border border-white/20 px-3 py-1.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div className="space-y-2">
                      <div className="text-[11px] text-[#C7BDB7]">Select Bank:</div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank'].map((b) => (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setSelectedBank(b)}
                            className={`py-1.5 px-2 text-xs text-center border cursor-pointer ${
                              selectedBank === b
                                ? 'bg-white text-black font-bold border-white'
                                : 'bg-black/40 text-[#C7BDB7] border-white/10 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                      <Banknote size={16} className="shrink-0" />
                      <span>
                        Cash on Delivery available. Please keep exact cash or pay delivery agent via UPI QR at doorstep.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown (Flipkart Style) */}
              <div className="p-4 bg-white/[0.03] border border-white/10 font-mono text-xs space-y-2">
                <div className="flex justify-between text-[#C7BDB7]">
                  <span>Price ({quantity} item{quantity > 1 ? 's' : ''})</span>
                  <span className="text-white">{formatPrice(totalOriginal)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Special Discount</span>
                  <span>-{formatPrice(totalSavings)}</span>
                </div>
                <div className="flex justify-between text-[#C7BDB7]">
                  <span>Delivery Charges</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span>{formatPrice(totalPayable)}</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold pt-1">
                  You will save {formatPrice(totalSavings)} on this order
                </div>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xl disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-black" />
                    <span>AUTHORIZING PAYMENT...</span>
                  </>
                ) : (
                  <>
                    <span>CONFIRM & PLACE ORDER ({formatPrice(totalPayable)})</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
