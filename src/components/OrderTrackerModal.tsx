import React, { useState } from 'react';
import { OrderReceipt } from '../types';
import { X, Search, CheckCircle2, Clock, AlertTriangle, ShieldCheck, CreditCard, RefreshCw } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayForOrder: (order: OrderReceipt) => void;
  initialOrderId?: string;
  allOrders: OrderReceipt[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  onPayForOrder,
  initialOrderId = '',
  allOrders
}) => {
  if (!isOpen) return null;

  const [searchTerm, setSearchTerm] = useState(initialOrderId);
  const [selectedOrder, setSelectedOrder] = useState<OrderReceipt | null>(
    initialOrderId
      ? allOrders.find((o) => o.id.toLowerCase() === initialOrderId.toLowerCase()) || null
      : allOrders.length > 0
      ? allOrders[0]
      : null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim().toLowerCase();
    if (!query) return;

    const found = allOrders.find(
      (o) =>
        o.id.toLowerCase().includes(query) ||
        o.playerId.toLowerCase().includes(query) ||
        (o.contact && o.contact.includes(query)) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(query))
    );

    setSelectedOrder(found || null);
  };

  const getStepStatus = (order: OrderReceipt) => {
    // Returns stage 1, 2, 3, or 4
    if (order.status === 'COMPLETED') return 4;
    if (order.status === 'PROCESSING') return 3;
    if (order.paymentStatus === 'VERIFYING' || order.paymentStatus === 'PAID') return 2;
    return 1;
  };

  const activeStep = selectedOrder ? getStepStatus(selectedOrder) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-[#faf8f0] border border-[#d2ded1] rounded-lg shadow-2xl max-w-lg w-full overflow-hidden rise-in max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracker-modal-title"
      >
        {/* Header */}
        <div className="bg-[#126353] text-[#fbf6ea] p-4 px-5 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-mono text-[#d6ede4] uppercase tracking-wider">
              অর্ডার স্ট্যাটাস অনুসন্ধান
            </div>
            <h3 id="tracker-modal-title" className="text-lg font-bold font-display leading-tight">
              অর্ডার লাইভ ট্র্যাকিং
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#d6ede4] hover:text-white p-1 rounded hover:bg-white/10"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8e86]"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="অর্ডার রেফারেন্স বা মোবাইল নম্বর দিন..."
                className="store-input pl-9 text-xs sm:text-sm font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-[#126353] hover:bg-[#0e4f42] text-white px-4 py-2 rounded text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              খুঁজুন
            </button>
          </form>

          {/* Result view */}
          {selectedOrder ? (
            <div className="space-y-4">
              {/* Order Card Info */}
              <div className="bg-white border border-[#deded3] rounded-md p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-mono text-[#71857c] block">
                      অর্ডার আইডি:
                    </span>
                    <strong className="font-mono text-xs text-[#126353] select-all">
                      {selectedOrder.id}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#71857c] block">পরিমাণ</span>
                    <strong className="text-lg font-display text-[#126353]">
                      ৳{selectedOrder.amountTaka.toLocaleString('en-BD')}
                    </strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#f0f0ea]">
                  <div>
                    <span className="text-[#7d8f87] block">গেম ও প্যাকেজ:</span>
                    <span className="font-semibold text-[#1c382f]">
                      {selectedOrder.game} ({selectedOrder.packageName})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7d8f87] block">Player UID:</span>
                    <span className="font-mono font-semibold text-[#1c382f]">
                      {selectedOrder.playerId}
                    </span>
                  </div>
                  {selectedOrder.contact && (
                    <div>
                      <span className="text-[#7d8f87] block">যোগাযোগ:</span>
                      <span className="font-mono text-[#1c382f]">
                        {selectedOrder.contact}
                      </span>
                    </div>
                  )}
                  {selectedOrder.transactionId && (
                    <div>
                      <span className="text-[#7d8f87] block">TrxID:</span>
                      <span className="font-mono font-semibold text-[#126353]">
                        {selectedOrder.transactionId} ({selectedOrder.paymentMethod || 'bKash'})
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#f0f0ea]">
                  <span className="bg-[#f4e4c9] text-[#765533] px-2 py-0.5 rounded text-[11px] font-mono font-medium">
                    অর্ডার: {selectedOrder.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                      selectedOrder.paymentStatus === 'PAID'
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : selectedOrder.paymentStatus === 'VERIFYING'
                        ? 'bg-[#fef9c3] text-[#854d0e]'
                        : 'bg-[#fee2e2] text-[#991b1b]'
                    }`}
                  >
                    পেমেন্ট: {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress Stepper */}
              <div className="bg-[#f5f8f3] border border-[#d2ded1] rounded-md p-4">
                <h4 className="text-xs font-bold text-[#1f3b32] mb-3">
                  অর্ডারের অগ্রগতি (Live Status):
                </h4>

                <div className="relative pl-6 space-y-4">
                  {/* Step 1 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        activeStep >= 1
                          ? 'bg-[#126353] text-white'
                          : 'bg-[#d2ded1] text-[#63756c]'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="text-xs font-semibold text-[#1c382f]">
                      ১. অর্ডার তৈরি সম্পন্ন
                    </div>
                    <p className="text-[11px] text-[#6d7e76]">
                      আপনার অর্ডার সিস্টেমে নিবন্ধিত হয়েছে।
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        activeStep >= 2
                          ? 'bg-[#126353] text-white'
                          : 'bg-[#d2ded1] text-[#63756c]'
                      }`}
                    >
                      {activeStep >= 2 ? '✓' : '২'}
                    </div>
                    <div className="text-xs font-semibold text-[#1c382f]">
                      ২. পেমেন্ট যাচাই (bKash/Nagad)
                    </div>
                    <p className="text-[11px] text-[#6d7e76]">
                      {selectedOrder.paymentStatus === 'UNPAID'
                        ? 'পেমেন্ট এখনো বাকি। নিচে বাটনে ক্লিক করে TrxID জমা দিন।'
                        : selectedOrder.paymentStatus === 'VERIFYING'
                        ? 'আপনার TrxID পেয়েছি, এডমিন পেমেন্ট চেক করছেন।'
                        : 'পেমেন্ট সফলভাবে নিশ্চিত হয়েছে।'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        activeStep >= 3
                          ? 'bg-[#126353] text-white'
                          : 'bg-[#d2ded1] text-[#63756c]'
                      }`}
                    >
                      {activeStep >= 3 ? '✓' : '৩'}
                    </div>
                    <div className="text-xs font-semibold text-[#1c382f]">
                      ৩. ইন-গেম রিচার্জ প্রসেসিং
                    </div>
                    <p className="text-[11px] text-[#6d7e76]">
                      Player ID ({selectedOrder.playerId})-তে ডায়মন্ড/ইউসি পাঠানো হচ্ছে।
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className="relative">
                    <div
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        activeStep >= 4
                          ? 'bg-[#126353] text-white'
                          : 'bg-[#d2ded1] text-[#63756c]'
                      }`}
                    >
                      {activeStep >= 4 ? '✓' : '৪'}
                    </div>
                    <div className="text-xs font-semibold text-[#1c382f]">
                      ৪. ডেলিভারি সম্পন্ন!
                    </div>
                    <p className="text-[11px] text-[#6d7e76]">
                      টপ-আপ সফলভাবে আপনার গেমে যুক্ত হয়েছে।
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Now Button if UNPAID */}
              {selectedOrder.paymentStatus === 'UNPAID' && (
                <button
                  type="button"
                  onClick={() => onPayForOrder(selectedOrder)}
                  className="w-full bg-[#126353] hover:bg-[#0c473b] text-white py-2.5 px-4 rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <CreditCard size={15} />
                  <span>এখনই টাকা পরিশোধ করুন (TrxID দিন)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-[#6c7d75] space-y-2">
              <AlertTriangle size={32} className="mx-auto text-[#df794f]" />
              <p className="text-sm font-medium">কোনো অর্ডার খুঁজে পাওয়া যায়নি</p>
              <p className="text-xs">
                অনুগ্রহ করে আপনার সঠিক অর্ডার রেফারেন্স আইডি অথবা মোবাইল নম্বর দিয়ে খুঁজুন।
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
