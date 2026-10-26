import React, { useState, useEffect } from 'react';
import { X, Search, Package, Truck, CheckCircle2, MapPin, Clock, ArrowRight, ShieldCheck, Download, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CustomerOrder } from '../types/store';

export const OrderTrackingModal: React.FC = () => {
  const {
    isOrderTrackingOpen,
    setIsOrderTrackingOpen,
    showToast,
    formatPrice,
    orders,
    trackingOrderId,
    setTrackingOrderId,
  } = useStore();

  const [orderInput, setOrderInput] = useState('');
  const [activeOrder, setActiveOrder] = useState<CustomerOrder | null>(null);

  // Sync active order when modal opens or trackingOrderId changes
  useEffect(() => {
    if (isOrderTrackingOpen) {
      if (trackingOrderId) {
        const found = orders.find((o) => o.id.toUpperCase() === trackingOrderId.toUpperCase());
        if (found) {
          setActiveOrder(found);
          setOrderInput(found.id);
          return;
        }
      }
      if (orders.length > 0) {
        setActiveOrder(orders[0]);
        setOrderInput(orders[0].id);
      } else {
        setActiveOrder(null);
        setOrderInput('');
      }
    }
  }, [isOrderTrackingOpen, trackingOrderId, orders]);

  if (!isOrderTrackingOpen) return null;

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = orderInput.trim().toUpperCase();
    if (!clean) return;

    const matched = orders.find((o) => o.id.toUpperCase() === clean);
    if (matched) {
      setActiveOrder(matched);
      setTrackingOrderId(matched.id);
      showToast(`Loaded order ${clean}`, 'success');
    } else {
      // Create simulated order response for unlisted valid ID
      setActiveOrder({
        id: clean,
        createdAt: new Date().toISOString(),
        items: [
          {
            productId: 'demo-1',
            name: 'Oversized Streetwear Piece',
            price: 2499,
            image: '/images/prod_oversized_graphic_tee.jpg',
            size: 'L',
            color: 'Pitch Black',
            quantity: 1,
          },
        ],
        subtotal: 2499,
        discount: 500,
        shipping: 0,
        total: 1999,
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        shippingAddress: {
          fullName: 'Member Guest',
          phone: '+91 98765 43210',
          street: 'MG Road, Labbipet',
          city: 'Vijayawada',
          state: 'Andhra Pradesh',
          pincode: '520010',
        },
        status: 'Shipped',
        awbNumber: 'BD-94820194',
        estimatedDelivery: 'Tomorrow, 5 PM',
      });
      showToast(`Retrieved BlueDart tracking for #${clean}`, 'info');
    }
  };

  const statusLevels: Record<string, number> = {
    'Confirmed': 1,
    'Processing': 2,
    'Packed at Hub': 2,
    'Shipped': 3,
    'Out for Delivery': 4,
    'Delivered': 5,
    'Cancelled': -1,
  };

  const currentLevel = activeOrder ? (statusLevels[activeOrder.status] || 3) : 0;

  const steps = [
    {
      title: 'Order Confirmed',
      time: 'Verified & Logged',
      level: 1,
      desc: 'Payment verified & order dispatched to Vijayawada packaging studio',
    },
    {
      title: 'Processing & Packed',
      time: 'Inspected & Sealed',
      level: 2,
      desc: '6-point fabric inspection passed, sealed in archival protective wrap at Vijayawada AP Hub',
    },
    {
      title: 'Shipped',
      time: 'BlueDart Express Air',
      level: 3,
      desc: 'BlueDart Express shipment dispatched departing Vijayawada Central DC (MG Road, AP)',
    },
    {
      title: 'Out for Delivery',
      time: 'Doorstep Courier Routing',
      level: 4,
      desc: 'Assigned to BlueDart express delivery agent for doorstep drop',
    },
    {
      title: 'Delivered',
      time: 'Handover Completed',
      level: 5,
      desc: 'Doorstep delivery completed with secure contactless OTP verification',
    },
  ];

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={() => setIsOrderTrackingOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl bg-[#171617] text-[#F6F1E9] border border-white/20 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-[#4A0718] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-white" />
            <h3 className="text-base font-black uppercase font-headline tracking-wider text-white">
              SNAPSTER LIVE ORDER TRACKING
            </h3>
          </div>
          <button
            onClick={() => setIsOrderTrackingOpen(false)}
            className="p-1 text-white hover:opacity-75 cursor-pointer"
            aria-label="Close tracking"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Recent Orders Tabs (If User Placed Orders) */}
          {orders.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-[#C7BDB7] tracking-wider block font-bold">
                Your Placed Orders ({orders.length}):
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setActiveOrder(o);
                      setTrackingOrderId(o.id);
                      setOrderInput(o.id);
                    }}
                    className={`px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                      activeOrder?.id === o.id
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                    }`}
                  >
                    <span>{o.id}</span>
                    <span className="ml-1.5 opacity-60 text-[10px]">({o.items.length} items)</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Order Input */}
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-3 text-[#C7BDB7]" />
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SNP-102948)"
                className="w-full bg-[#121112] border border-white/15 pl-9 pr-3 py-2.5 text-xs text-white uppercase font-mono placeholder-[#C7BDB7]/50 focus:outline-none focus:border-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-white text-[#111011] hover:bg-[#F6F1E9] text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
            >
              Track
            </button>
          </form>

          {activeOrder ? (
            <div className="space-y-5 animate-fade-in">
              {/* Active Order Details Banner */}
              <div className="bg-[#201D20] border border-white/10 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs font-mono">
                  <div>
                    <span className="text-[#C7BDB7]">Tracking ID:</span>{' '}
                    <strong className="text-white font-bold">{activeOrder.id}</strong>
                  </div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Truck size={14} />
                    <span>BlueDart AWB #{activeOrder.awbNumber || '94820194'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[#C7BDB7] uppercase block">Carrier</span>
                    <span className="text-white font-bold">BlueDart Express AP</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C7BDB7] uppercase block">Dispatch Hub</span>
                    <span className="text-white font-bold">Vijayawada Hub (AP)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C7BDB7] uppercase block">Destination</span>
                    <span className="text-white font-bold">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.pincode}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#C7BDB7] uppercase block">Status</span>
                    <span className="text-emerald-400 font-bold">{activeOrder.status || 'In Transit'}</span>
                  </div>
                </div>
              </div>

              {/* Visual Step Timeline */}
              <div className="space-y-4 pt-1">
                <span className="text-xs font-mono uppercase text-[#C7BDB7] tracking-widest block font-bold">
                  Shipment Timeline:
                </span>

                <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                  {steps.map((step, idx) => {
                    const isCompleted = step.level < currentLevel || (step.level === 5 && currentLevel === 5);
                    const isCurrent = step.level === currentLevel && currentLevel < 5;

                    return (
                      <div key={idx} className="relative">
                        {/* Step Icon */}
                        <div
                          className={`absolute -left-6 top-0 w-4 h-4 rounded-full flex items-center justify-center border ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-400 text-black'
                              : isCurrent
                              ? 'bg-[#4A0718] border-white animate-pulse'
                              : 'bg-[#171617] border-white/20'
                          }`}
                        >
                          {isCompleted && <CheckCircle2 size={10} />}
                        </div>

                        <div className="font-mono text-xs">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold ${isCurrent ? 'text-white' : isCompleted ? 'text-white/90' : 'text-[#C7BDB7]/60'}`}>
                              {step.title}
                            </span>
                            <span className="text-[11px] text-[#C7BDB7]">{step.time}</span>
                          </div>
                          <p className="text-[11px] text-[#C7BDB7] mt-0.5">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real Items in this Order */}
              <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase text-[#C7BDB7] tracking-wider font-bold">
                    Order Items ({activeOrder.items.length}):
                  </span>
                  <button
                    onClick={handlePrintInvoice}
                    className="text-[11px] text-[#C7BDB7] hover:text-white flex items-center gap-1 cursor-pointer underline"
                  >
                    <Printer size={12} />
                    <span>Print Receipt</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-white/5 border border-white/5">
                      <img src={item.image} alt={item.name} className="w-12 h-14 object-cover object-center bg-black/40" />
                      <div className="flex-1">
                        <div className="text-white font-bold">{item.name}</div>
                        <div className="text-[#C7BDB7] text-[11px]">Size {item.size} · {item.color} · Qty {item.quantity}</div>
                      </div>
                      <div className="text-white font-bold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 flex justify-between items-center text-xs border-t border-white/5 text-[#C7BDB7]">
                  <span>Total Paid via {activeOrder.paymentMethod}</span>
                  <span className="text-base font-bold text-white">{formatPrice(activeOrder.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#C7BDB7] space-y-2">
              <Package size={36} className="mx-auto text-white/30" />
              <p className="text-sm text-white font-bold uppercase font-mono">No Active Order Selected</p>
              <p className="text-xs text-[#C7BDB7] max-w-sm mx-auto">
                Enter your 8-digit order number from your confirmation SMS or checkout to track live delivery progress.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
