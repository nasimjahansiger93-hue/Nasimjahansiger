import React, { useState } from 'react';
import { OrderReceipt } from '../types';
import { X, Search, Check, RefreshCw, Copy, ExternalLink, ShieldAlert, CheckCircle, Clock } from 'lucide-react';

interface AdminOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderReceipt[];
  onUpdateStatus: (orderId: string, status: OrderReceipt['status'], paymentStatus: OrderReceipt['paymentStatus']) => void;
  onRefresh: () => void;
}

export const AdminOrdersModal: React.FC<AdminOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateStatus,
  onRefresh
}) => {
  if (!isOpen) return null;

  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'VERIFYING' | 'COMPLETED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (filter === 'PENDING' && o.status !== 'PENDING') return false;
    if (filter === 'VERIFYING' && o.paymentStatus !== 'VERIFYING') return false;
    if (filter === 'COMPLETED' && o.status !== 'COMPLETED') return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.playerId.toLowerCase().includes(q) ||
        (o.contact && o.contact.includes(q)) ||
        o.game.toLowerCase().includes(q) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-[#faf8f0] border border-[#d2ded1] rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden rise-in max-h-[94vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-modal-title"
      >
        {/* Header */}
        <div className="bg-[#126353] text-[#fbf6ea] p-4 px-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <div className="text-[11px] font-mono text-[#d6ede4] uppercase tracking-wider">
                অ্যাডমিন কনসোল
              </div>
              <h3 id="admin-modal-title" className="text-lg font-bold font-display leading-tight">
                TopUp Zone BD অর্ডার ড্যাশবোর্ড ({orders.length})
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefresh}
              className="text-[#d6ede4] hover:text-white p-1.5 rounded hover:bg-white/10 transition-colors"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw size={16} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-[#d6ede4] hover:text-white p-1 rounded hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-4 bg-white border-b border-[#deded3] flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filter === 'ALL'
                  ? 'bg-[#126353] text-white'
                  : 'bg-[#f0ede1] text-[#4d5e56] hover:bg-[#e4e0d2]'
              }`}
            >
              সব অর্ডার ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('VERIFYING')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filter === 'VERIFYING'
                  ? 'bg-[#b45309] text-white'
                  : 'bg-[#fef9c3] text-[#854d0e] hover:bg-[#fef08a]'
              }`}
            >
              পেমেন্ট যাচাই প্রয়োজন ({orders.filter((o) => o.paymentStatus === 'VERIFYING').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filter === 'PENDING'
                  ? 'bg-[#126353] text-white'
                  : 'bg-[#f0ede1] text-[#4d5e56] hover:bg-[#e4e0d2]'
              }`}
            >
              পেন্ডিং ({orders.filter((o) => o.status === 'PENDING').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${
                filter === 'COMPLETED'
                  ? 'bg-[#166534] text-white'
                  : 'bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]'
              }`}
            >
              সম্পন্ন ({orders.filter((o) => o.status === 'COMPLETED').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7d8e86]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="UID, রেফারেন্স বা TrxID..."
              className="store-input pl-8 py-1.5 text-xs font-mono"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-y-auto p-4 flex-1">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-[#6e7d76]">
              কোনো অর্ডার পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                const isPaid = order.paymentStatus === 'PAID';
                const isVerifying = order.paymentStatus === 'VERIFYING';
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#deded3] rounded-md p-3.5 space-y-2 hover:border-[#176a59] transition-colors"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#18392f]">
                            {order.game}
                          </span>
                          <span className="bg-[#edf2ea] text-[#126353] text-[11px] font-semibold px-2 py-0.5 rounded">
                            {order.packageName}
                          </span>
                          <span className="text-xs font-bold text-[#e66a3a] font-display">
                            ৳{order.amountTaka}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#6e7d76]">
                          <span>
                            রেফারেন্স:{' '}
                            <span className="font-mono text-[#176a59] font-medium select-all">
                              {order.id.slice(0, 13)}...
                            </span>
                          </span>
                          <span>
                            তারিখ:{' '}
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#f4e4c9] text-[#765533] px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            isPaid
                              ? 'bg-[#dcfce7] text-[#166534]'
                              : isVerifying
                              ? 'bg-[#fef9c3] text-[#854d0e]'
                              : 'bg-[#fee2e2] text-[#991b1b]'
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>

                    {/* UID and Payment info */}
                    <div className="bg-[#f9faf7] border border-[#e4ebe2] rounded p-2.5 flex flex-wrap justify-between items-center gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#607168] font-medium">Player UID:</span>
                        <span className="font-mono font-bold text-[#144f43] bg-white px-2 py-1 rounded border border-[#ccd8ca] select-all">
                          {order.playerId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(order.playerId, `uid-${order.id}`)}
                          className="text-[#176a59] hover:underline text-[11px] inline-flex items-center gap-0.5"
                          title="UID কপি করুন"
                        >
                          <Copy size={12} />
                          {copiedId === `uid-${order.id}` ? 'কপি!' : 'কপি'}
                        </button>
                      </div>

                      {order.transactionId && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#607168] font-medium">TrxID:</span>
                          <span className="font-mono font-bold text-[#92400e] bg-[#fefce8] px-2 py-0.5 rounded border border-[#fef08a] select-all">
                            {order.transactionId} ({order.paymentMethod || 'bKash'})
                          </span>
                          {order.contact && (
                            <span className="text-[#607168]">
                              নম্বর: <b className="font-mono">{order.contact}</b>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action buttons for admin */}
                    <div className="flex flex-wrap gap-2 pt-1 justify-end">
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(order.id, 'PROCESSING', 'PAID')}
                          className="bg-[#126353] hover:bg-[#0d4d40] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Check size={13} />
                          <span>পেমেন্ট নিশ্চিত (Mark Paid)</span>
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          type="button"
                          onClick={() => onUpdateStatus(order.id, 'COMPLETED', 'PAID')}
                          className="bg-[#166534] hover:bg-[#14532d] text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle size={13} />
                          <span>ডেলিভারি সম্পন্ন (Mark Done)</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs text-[#166534] font-medium flex items-center gap-1">
                          <Check size={13} /> অর্ডার সম্পন্ন হয়েছে
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
