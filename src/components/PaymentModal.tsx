import React, { useState } from 'react';
import { OrderReceipt } from '../types';
import { PAYMENT_METHODS } from '../data/catalog';
import { X, Copy, Check, ShieldCheck, ArrowRight, AlertCircle, PhoneCall } from 'lucide-react';

interface PaymentModalProps {
  order: OrderReceipt | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPayment: (orderId: string, data: { paymentMethod: string; transactionId: string; senderNumber?: string }) => Promise<boolean>;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onSubmitPayment
}) => {
  if (!isOpen || !order) return null;

  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [senderNumber, setSenderNumber] = useState(order.contact || '');
  const [transactionId, setTransactionId] = useState('');
  const [copiedMethodId, setCopiedMethodId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod) || PAYMENT_METHODS[0];

  const handleCopyNumber = (methodId: string, num: string) => {
    const plain = num.replace(/[^0-9]/g, '');
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(plain);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = plain;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedMethodId(methodId);
      setTimeout(() => setCopiedMethodId(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!transactionId.trim()) {
      setError('অনুগ্রহ করে Transaction ID (TrxID) লিখুন');
      return;
    }

    if (transactionId.trim().length < 5) {
      setError('সঠিক TrxID দিন (কমপক্ষে ৫ বা ততোধিক অক্ষর)');
      return;
    }

    setIsSubmitting(true);
    const success = await onSubmitPayment(order.id, {
      paymentMethod: selectedMethod,
      transactionId: transactionId.trim().toUpperCase(),
      senderNumber: senderNumber.trim() || undefined
    });
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } else {
      setError('পেমেন্ট তথ্য সাবমিট করা যায়নি। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-[#faf8f0] border border-[#d2ded1] rounded-lg shadow-2xl max-w-lg w-full overflow-hidden rise-in max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
      >
        {/* Header */}
        <div className="bg-[#126353] text-[#fbf6ea] p-4 px-5 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-mono text-[#d6ede4] uppercase tracking-wider">
              ম্যানুয়াল পেমেন্ট গেটওয়ে
            </div>
            <h3 id="payment-modal-title" className="text-lg font-bold font-display leading-tight">
              টাকা পরিশোধ ও TrxID জমা দিন
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
          {/* Order Summary banner */}
          <div className="bg-[#edf3eb] border border-[#bcd2c0] rounded p-3 text-xs flex justify-between items-center">
            <div>
              <div className="text-[#65766e]">অর্ডার রেফারেন্স:</div>
              <div className="font-mono font-bold text-[#176a59] text-[11px] truncate max-w-[200px]">
                {order.id}
              </div>
              <div className="text-[#334e44] font-medium mt-0.5">
                {order.game} • {order.packageName}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[#65766e] text-[11px]">পরিশোধযোগ্য মূল্য</span>
              <div className="text-xl font-bold font-display text-[#126353]">
                ৳{order.amountTaka.toLocaleString('en-BD')}
              </div>
            </div>
          </div>

          {/* Payment Method Selector with 1-click copy support */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#274138]">
                পেমেন্ট মাধ্যম বেছে নিন:
              </label>
              <span className="text-[10px] text-[#176a59] font-medium bg-[#eaf1e8] px-2 py-0.5 rounded">
                যেকোনো নম্বরে ১-ক্লিকে কপি করুন
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = method.id === selectedMethod;
                const isCopied = copiedMethodId === method.id;
                return (
                  <div
                    key={method.id}
                    className={`p-2 rounded border transition-all flex flex-col items-center justify-between gap-1.5 relative ${
                      isSelected
                        ? 'border-[#126353] bg-[#eaf1e8] shadow-xs text-[#126353] font-bold'
                        : 'border-[#deded3] bg-white text-[#4a5e56] hover:bg-[#f6f5ec]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className="w-full text-center focus:outline-hidden"
                    >
                      <span className="text-xs block font-bold">{method.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#6d7e77] block font-mono font-normal">
                        {method.number}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMethod(method.id);
                        handleCopyNumber(method.id, method.number);
                      }}
                      className={`w-full py-1 px-1.5 rounded text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                        isCopied
                          ? 'bg-[#166534] text-white'
                          : 'bg-[#126353]/10 hover:bg-[#126353] hover:text-white text-[#126353]'
                      }`}
                      title={`${method.name} নম্বর কপি করুন`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={11} strokeWidth={3} />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Payment Method Instructions Box */}
          <div className="bg-white border-2 border-[#126353]/30 rounded-lg p-4 space-y-3 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-[#6e7d77] block font-medium">
                  {activeMethod.name} নম্বর (Personal - Send Money)
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-[#126353] tracking-wide select-all">
                  {activeMethod.number}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyNumber(activeMethod.id, activeMethod.number)}
                className={`py-2 px-3.5 rounded-md text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                  copiedMethodId === activeMethod.id
                    ? 'bg-[#166534] text-white ring-2 ring-[#166534]/30 scale-102'
                    : 'bg-[#126353] hover:bg-[#0d4d40] text-white hover:scale-102'
                }`}
                data-testid={`button-copy-${activeMethod.id.toLowerCase()}`}
              >
                {copiedMethodId === activeMethod.id ? (
                  <>
                    <Check size={15} strokeWidth={2.5} />
                    <span>নম্বর কপি হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>ওয়ান-ক্লিক নম্বর কপি</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] text-[#556961] bg-[#fdfbfa] border-l-3 border-[#e66a3a] p-2.5 pl-3 rounded-r">
              <strong>কীভাবে টাকা পাঠাবেন:</strong>
              <ol className="list-decimal list-inside space-y-0.5 mt-1">
                <li>আপনার {activeMethod.id} অ্যাপে গিয়ে <b>Send Money</b> অপশন সিলেক্ট করুন।</li>
                <li>উপরের নম্বরে (<b>01778796778</b>) ঠিক <b>৳{order.amountTaka}</b> টাকা পাঠান।</li>
                <li>টাকা সফলভাবে পাঠানোর পর যে <b>Transaction ID (TrxID)</b> পাবেন তা নিচে দিন।</li>
              </ol>
            </div>
          </div>

          {/* Form to submit TrxID */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-[#274138] mb-1">
                Transaction ID (TrxID) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                placeholder="যেমন: BLM7829104"
                className="store-input font-mono uppercase text-sm tracking-wide"
                required
              />
              <span className="text-[11px] text-[#71827a] mt-0.5 block">
                টাকা পাঠানোর পর কনফার্মেশন এসএমএস বা অ্যাপের ইনবক্সে TrxID পাবেন।
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#274138] mb-1">
                যে নম্বর থেকে টাকা পাঠিয়েছেন (ঐচ্ছিক)
              </label>
              <input
                type="tel"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="store-input font-mono text-sm"
              />
            </div>

            {error && (
              <div className="bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs p-2.5 rounded flex items-center gap-2">
                <AlertCircle size={14} className="flex-none" />
                <span>{error}</span>
              </div>
            )}

            {isSuccess && (
              <div className="bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] text-xs p-3 rounded flex items-center gap-2">
                <Check size={16} className="text-[#059669] flex-none" />
                <span>
                  ধন্যবাদ! TrxID জমা হয়েছে। আপনার পেমেন্ট ভেরিফাই করে ৫-১৫ মিনিটে টপ-আপ প্রদান করা হবে।
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-[#126353] hover:bg-[#0d4d40] text-white py-2.5 rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>পেমেন্ট তথ্য জমা দিন</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Help Link */}
          <div className="pt-2 text-center text-xs text-[#6e7d77] border-t border-[#deded3]">
            সমস্যা হচ্ছে? হোয়াটসঅ্যাপে আমাদের সাথে যোগাযোগ করুন:{' '}
            <a
              href="https://wa.me/8801778796778"
              target="_blank"
              rel="noreferrer"
              className="text-[#126353] font-bold underline inline-flex items-center gap-1"
            >
              <PhoneCall size={11} /> 01778-796778
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
