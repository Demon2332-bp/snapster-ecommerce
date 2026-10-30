import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, MapPin, Building2, Phone, Mail } from 'lucide-react';
import { CustomerOrder } from '../types/store';

interface TaxInvoiceModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const invoiceNumber = `INV-${order.id.toUpperCase()}`;
  const isAndhraPradesh =
    (order.shippingAddress.state &&
      order.shippingAddress.state.toLowerCase().includes('andhra')) ||
    (order.shippingAddress.pincode && order.shippingAddress.pincode.startsWith('52'));

  // Calculate 5% GST breakdown for apparel (HSN 6109 / 6101)
  // Total = Taxable Value + GST (5%)
  const gstRate = 0.05;
  const taxableBase = Math.round((order.subtotal / (1 + gstRate)) * 100) / 100;
  const totalGst = Math.round((order.subtotal - taxableBase) * 100) / 100;
  const cgst = isAndhraPradesh ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const sgst = isAndhraPradesh ? Math.round((totalGst / 2) * 100) / 100 : 0;
  const igst = !isAndhraPradesh ? totalGst : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto print:p-0 print:bg-white print:fixed print:inset-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-3xl bg-[#0D0C0D] text-[#F6F1E9] border border-white/20 shadow-2xl my-auto max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:border-none print:shadow-none print:bg-white print:text-black print:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Action Header (Hidden in Print) */}
        <div className="p-4 bg-[#1C1A1C] border-b border-white/10 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-black uppercase font-headline tracking-wider text-white">
              OFFICIAL GST TAX INVOICE • {invoiceNumber}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#4A0718] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#630920] transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer size={13} />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 font-sans text-xs bg-white text-zinc-900 print:p-0 print:overflow-visible">
          {/* Header & Seller Info */}
          <div className="border-b-2 border-zinc-900 pb-5 mb-5 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-headline font-black text-2xl tracking-tighter text-zinc-950 uppercase">
                  SNAPSTER
                </span>
                <span className="text-[10px] font-mono uppercase bg-zinc-900 text-white px-2 py-0.5 tracking-widest font-bold">
                  APPAREL CO.
                </span>
              </div>
              <p className="text-[11px] text-zinc-600 font-medium">
                SNAPSTER APPAREL PRIVATE LIMITED
              </p>
              <p className="text-[10px] text-zinc-500 max-w-sm mt-0.5">
                Central DC: 40-1-62, MG Road, Labbipet, Vijayawada, Andhra Pradesh - 520010
              </p>
              <p className="text-[10px] text-zinc-700 font-mono font-bold mt-1">
                GSTIN: <span className="text-zinc-950">37AAACS9821R1Z8</span> · State Code: 37 (AP)
              </p>
              <p className="text-[10px] text-zinc-500 font-mono">
                CIN: U18101AP2026PTC049210 · Care: concierge@snapster.in · +91 866 248 9000
              </p>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-200">
              <span className="text-xs uppercase font-mono font-black text-red-900 tracking-wider block">
                TAX INVOICE / CASH BILL
              </span>
              <p className="text-[10px] text-zinc-500 uppercase font-mono mt-0.5">
                (Original for Recipient)
              </p>
              <div className="mt-2 text-[11px] font-mono space-y-0.5">
                <p>
                  <strong className="text-zinc-900">Invoice No:</strong> {invoiceNumber}
                </p>
                <p>
                  <strong className="text-zinc-900">Date:</strong> {invoiceDate}
                </p>
                <p>
                  <strong className="text-zinc-900">Order ID:</strong> #{order.id}
                </p>
                <p>
                  <strong className="text-zinc-900">Payment:</strong> {order.paymentMethod} ({order.paymentStatus})
                </p>
                {order.paymentId && (
                  <p className="text-[10px] text-zinc-600 truncate max-w-[220px] sm:ml-auto">
                    TXN Ref: {order.paymentId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer / Billing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-zinc-300 p-3 mb-5 bg-zinc-50/80">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block mb-1">
                Billed To & Shipped To:
              </span>
              <p className="font-bold text-zinc-900 text-sm">
                {order.customerName || order.shippingAddress.fullName || 'Valued Customer'}
              </p>
              <p className="text-zinc-700 mt-0.5">
                {order.shippingAddress.street}
              </p>
              <p className="text-zinc-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p className="text-zinc-600 font-mono text-[11px] mt-1">
                Contact: {order.customerPhone || order.shippingAddress.phone || '+91 9876543210'}
              </p>
              {order.customerEmail && (
                <p className="text-zinc-600 font-mono text-[10px]">{order.customerEmail}</p>
              )}
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-zinc-200 pt-2 sm:pt-0 sm:pl-4 text-[11px] font-mono space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">
                Logistics & Dispatch Details:
              </span>
              <p>
                <strong>Dispatch Center:</strong> Vijayawada Hub (AP-01)
              </p>
              <p>
                <strong>Carrier:</strong> BlueDart Express / Delhivery Surface
              </p>
              <p>
                <strong>AWB / Tracking:</strong> {order.awbNumber || `BLUEDART-${order.id.slice(-6)}`}
              </p>
              <p>
                <strong>Place of Supply:</strong> {order.shippingAddress.state || 'Andhra Pradesh'}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-zinc-300 overflow-x-auto mb-5">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-zinc-900 text-white font-mono text-[10px] uppercase">
                  <th className="p-2 border-r border-zinc-700 w-8">#</th>
                  <th className="p-2 border-r border-zinc-700">Description of Goods</th>
                  <th className="p-2 border-r border-zinc-700 w-16">HSN</th>
                  <th className="p-2 border-r border-zinc-700 w-16">Size/Col</th>
                  <th className="p-2 border-r border-zinc-700 w-12 text-center">Qty</th>
                  <th className="p-2 border-r border-zinc-700 w-20 text-right">Unit Price</th>
                  <th className="p-2 w-20 text-right">Total (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50">
                    <td className="p-2 font-mono text-zinc-500 border-r border-zinc-200 text-center">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-zinc-200">
                      <p className="font-bold text-zinc-900">{item.name}</p>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        Proprietary Heavyweight Cotton Streetwear
                      </span>
                    </td>
                    <td className="p-2 font-mono text-zinc-600 border-r border-zinc-200">
                      6109
                    </td>
                    <td className="p-2 font-mono text-zinc-700 border-r border-zinc-200">
                      {item.size || 'M'} / {item.color || 'BLK'}
                    </td>
                    <td className="p-2 font-mono text-zinc-900 border-r border-zinc-200 text-center font-bold">
                      {item.quantity}
                    </td>
                    <td className="p-2 font-mono text-zinc-800 border-r border-zinc-200 text-right">
                      ₹{item.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-2 font-mono text-zinc-950 font-bold text-right">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation & Totals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="border border-zinc-200 p-3 bg-zinc-50/50 text-[10px] font-mono space-y-1">
              <span className="font-bold uppercase text-zinc-600 block mb-1">
                GST Tax Schedule Breakdown (5% Apparel Rate):
              </span>
              <div className="flex justify-between border-b border-zinc-200 pb-1">
                <span>Taxable Base Value:</span>
                <span className="font-bold">₹{taxableBase.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {isAndhraPradesh ? (
                <>
                  <div className="flex justify-between">
                    <span>CGST (2.5% Intra-State):</span>
                    <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (2.5% Intra-State AP):</span>
                    <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between">
                  <span>IGST (5.0% Inter-State):</span>
                  <span>₹{igst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-zinc-200 pt-1 text-zinc-900 font-bold">
                <span>Total Tax Component:</span>
                <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="border border-zinc-300 p-3 bg-zinc-100 text-xs font-mono space-y-1.5">
              <div className="flex justify-between text-zinc-600">
                <span>Items Subtotal:</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Promo Discount:</span>
                  <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Express Shipping Fee:</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-zinc-950 border-t-2 border-zinc-900 pt-2">
                <span>TOTAL INVOICE AMOUNT:</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[10px] text-zinc-500 italic mt-1">
                Amount Inclusive of all applicable Central & State Taxes.
              </p>
            </div>
          </div>

          {/* Footer Terms & Signatory */}
          <div className="border-t border-zinc-300 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-[10px] text-zinc-600">
            <div className="max-w-md space-y-1">
              <span className="font-bold text-zinc-900 uppercase font-mono block">
                Terms of Sale & Authenticity:
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                <li>100% Genuine SNAPSTER pieces crafted with European ring-spun cotton.</li>
                <li>7-day doorstep replacement for unworn pieces with tags intact.</li>
                <li>All disputes subject to Vijayawada (AP) jurisdiction.</li>
              </ul>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
              <div className="inline-block border border-zinc-400 p-2 bg-zinc-50 text-center font-mono">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                  For SNAPSTER APPAREL PVT LTD
                </span>
                <span className="text-xs font-bold text-zinc-900 block my-1">
                  [DIGITALLY AUTHORIZED]
                </span>
                <span className="text-[9px] text-zinc-500 block">
                  Authorised Signatory • Vijayawada AP
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Hidden in Print) */}
        <div className="p-3 bg-[#171617] border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#C7BDB7] print:hidden shrink-0">
          <span>SNAPSTER APPAREL CO. • Official Customer Tax Invoice</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white text-black font-bold uppercase text-[11px] hover:bg-[#F6F1E9] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
