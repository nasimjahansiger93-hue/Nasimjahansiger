import React, { useState } from 'react';
import { GameItem, GamePackage, OrderReceipt } from '../types';
import { AlertCircle, ArrowUpRight, Check, Copy, CreditCard, Lock, Sparkles } from 'lucide-react';

interface CheckoutColumnProps {
  game: GameItem;
  selectedPackage: GamePackage | null;
  onSubmitOrder: (data: { playerId: string; contact?: string }) => Promise<OrderReceipt | null>;
  isSubmitting: boolean;
  activeReceipt: OrderReceipt | null;
  onDismissReceipt: () => void;
  onOpenPaymentForReceipt: (receipt: OrderReceipt) => void;
  onTrackReceipt: (receipt: OrderReceipt) => void;
}

export const CheckoutColumn: React.FC<CheckoutColumnProps> = ({
  game,
  selectedPackage,
  onSubmitOrder,
  isSubmitting,
  activeReceipt,
  onDismissReceipt,
  onOpenPaymentForReceipt,
  onTrackReceipt
}) => {
  const [playerId, setPlayerId] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!playerId.trim()) {
      setError('সঠিক Player ID লিখুন (প্রয়োজনীয়)');
      return;
    }
    if (playerId.trim().length < 3) {
      setError('Player ID অত্যন্ত ছোট, কমপক্ষে ৩ অক্ষর বা ডিজিট হতে হবে');
      return;
    }
    if (!selectedPackage) {
      setError('অনুগ্রহ করে একটি প্যাকেজ নির্বাচন করুন');
      return;
    }

    const res = await onSubmitOrder({
      playerId: playerId.trim(),
      contact: contact.trim() || undefined
    });

    if (res) {
      setPlayerId('');
      setContact('');
    } else {
      setError('অর্ডার তৈরি করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।');
    }
  };

  const handleCopyReference = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="checkout-column" aria-label="অর্ডার ফর্ম">
      <div className="checkout-card">
        <div className="checkout-topline">
          <span className="eyebrow">
            <span className="eyebrow-line"></span> অর্ডার তৈরি
          </span>
          <span className="step-tag font-mono">STEP 01</span>
        </div>

        <h2>আপনার তথ্য দিন</h2>
        <p className="checkout-intro">Player ID ঠিক আছে কিনা একবার মিলিয়ে নিন।</p>

        <form onSubmit={handleSubmit} className="order-form" noValidate>
          {/* Player ID Field */}
          <div className="field-block">
            <label className="field-label" htmlFor="player-id-input">
              <span>Player ID / UID</span>
              <span className="required-mark">প্রয়োজনীয়</span>
            </label>
            <input
              id="player-id-input"
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder={game.playerPlaceholder}
              autoComplete="off"
              className="store-input font-mono"
              data-testid="input-player-id"
              required
            />
            <span className="field-help">{game.playerHint}</span>
          </div>

          {/* Contact Field */}
          <div className="field-block">
            <label className="field-label" htmlFor="contact-input">
              <span>যোগাযোগ নম্বর (হোয়াটসঅ্যাপ / মোবাইল)</span>
              <span className="optional-mark">ঐচ্ছিক</span>
            </label>
            <input
              id="contact-input"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="01XXXXXXXXX"
              autoComplete="tel"
              className="store-input font-mono"
              data-testid="input-contact"
            />
            <span className="field-help">জরুরী প্রয়োজনে এসএমএস বা আপডেটের জন্য ব্যবহার হবে।</span>
          </div>

          {/* Order Total summary */}
          <div className="order-total" data-testid="text-order-total">
            <div>
              <span>নির্বাচিত গেম:</span>
              <strong>{game.name}</strong>
            </div>
            <div>
              <span>নির্বাচিত প্যাকেজ:</span>
              <strong>{selectedPackage ? selectedPackage.name : 'প্যাকেজ বাছাই করুন'}</strong>
            </div>
            <div className="total-amount border-t border-[#d4ded3] pt-2 mt-1">
              <span>মোট মূল্য:</span>
              <strong>
                {selectedPackage ? (
                  <>৳{selectedPackage.priceTaka.toLocaleString('en-BD')}</>
                ) : (
                  '—'
                )}
              </strong>
            </div>
          </div>

          {error && (
            <div className="form-error bg-[#fef2f2] border border-[#fecaca] text-[#b91c1c] text-xs p-3 rounded flex items-center gap-2" role="alert" data-testid="error-create-order">
              <AlertCircle size={15} className="flex-none" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="submit-button font-display"
            disabled={isSubmitting || !selectedPackage}
            data-testid="button-submit-order"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>অর্ডার তৈরি হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>অর্ডার তৈরি করুন</span>
                <ArrowUpRight size={17} />
              </>
            )}
          </button>

          <p className="submit-caption">
            <Lock size={13} />
            <span>জমা দিলে একটি নিরাপদ অর্ডার রেফারেন্স আইডি পাবেন</span>
          </p>
        </form>

        {/* One-Click Copy Payment Box */}
        <div className="mt-4 pt-3.5 border-t border-[#deded3] bg-[#faf8f0] p-3 rounded-md border border-[#e4ebe0]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-[#176a59] flex items-center gap-1">
              <span>bKash / Nagad / Rocket (Send Money)</span>
            </span>
            <span className="text-[9px] bg-[#e66a3a] text-white font-bold px-1.5 py-0.2 rounded uppercase tracking-wider">
              ১-ক্লিক কপি
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="font-mono text-sm font-bold text-[#144337] tracking-wider select-all">
              01778-796778
            </div>
            <button
              type="button"
              onClick={() => {
                const num = '01778796778';
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(num);
                } else {
                  const ta = document.createElement('textarea');
                  ta.value = num;
                  document.body.appendChild(ta);
                  ta.select();
                  document.execCommand('copy');
                  document.body.removeChild(ta);
                }
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-[#166534] text-white'
                  : 'bg-[#126353] hover:bg-[#0c473b] text-white hover:scale-102'
              }`}
              title="নম্বর কপি করুন (01778796778)"
            >
              {copied ? (
                <>
                  <Check size={12} strokeWidth={3} />
                  <span>কপি হয়েছে!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>নম্বর কপি</span>
                </>
              )}
            </button>
          </div>
          <div className="text-[10px] text-[#6d7e76] mt-1.5 flex items-center gap-1">
            <span>Personal একাউন্ট • টাকা পাঠিয়ে নিচে TrxID জমা দিন</span>
          </div>
        </div>
      </div>

      {/* Truth Disclaimer Card */}
      <div className="truth-card" data-testid="status-order-disclaimer">
        <div className="truth-icon">
          <AlertCircle size={18} />
        </div>
        <div>
          <strong>অর্ডার মানেই সরাসরি পেমেন্ট বা ডেলিভারি নয়</strong>
          <p>
            এই অর্ডারটি <b>PENDING</b> এবং <b>UNPAID</b> হিসেবে তৈরি হবে। বিকাশ/নগদে টাকা
            (<b>01778796778</b>) পাঠিয়ে TrxID জমা দিলে এডমিন যাচাই করে ৫-১৫ মিনিটের মধ্যে টপ-আপ সম্পন্ন করবে।
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      {activeReceipt && (
        <section
          className="receipt-card rise-in"
          aria-live="polite"
          aria-labelledby="receipt-title"
          data-testid="panel-order-receipt"
        >
          <div className="receipt-top">
            <span className="receipt-check">
              <Check size={20} strokeWidth={2.5} />
            </span>
            <button
              type="button"
              onClick={onDismissReceipt}
              className="receipt-dismiss hover:text-[#203a31]"
              aria-label="রসিদ বন্ধ করুন"
              data-testid="button-dismiss-receipt"
            >
              ×
            </button>
          </div>

          <span className="eyebrow mt-2">
            <span className="eyebrow-line"></span> রেফারেন্স তৈরি হয়েছে
          </span>
          <h3 id="receipt-title">আপনার অর্ডার রেডি।</h3>
          <p className="receipt-subtitle">
            অর্ডার রেফারেন্স সংরক্ষণ করুন। নিচের বাটনে ক্লিক করে সহজে পেমেন্ট সম্পন্ন করুন।
          </p>

          <div className="receipt-reference">
            <div className="flex justify-between items-center">
              <span>অর্ডার রেফারেন্স আইডি</span>
              <button
                type="button"
                onClick={() => handleCopyReference(activeReceipt.id)}
                className="text-[11px] font-mono text-[#176a59] hover:underline flex items-center gap-1"
                title="আইডি কপি করুন"
              >
                <Copy size={12} />
                <span>{copied ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
              </button>
            </div>
            <strong className="font-mono text-xs select-all" data-testid="text-order-reference">
              {activeReceipt.id}
            </strong>
          </div>

          <div className="receipt-details">
            <div>
              <span>গেম</span>
              <strong data-testid="text-receipt-game">{activeReceipt.game}</strong>
            </div>
            <div>
              <span>প্যাকেজ</span>
              <strong data-testid="text-receipt-package">{activeReceipt.packageName}</strong>
            </div>
            <div>
              <span>Player ID</span>
              <strong className="font-mono">{activeReceipt.playerId}</strong>
            </div>
            <div>
              <span>মোট পরিমাণ</span>
              <strong data-testid="text-receipt-amount">
                ৳{activeReceipt.amountTaka.toLocaleString('en-BD')}
              </strong>
            </div>
          </div>

          <div className="receipt-statuses">
            <span data-testid="status-receipt-order">
              <i></i> অর্ডার: {activeReceipt.status}
            </span>
            <span data-testid="status-receipt-payment">
              <i></i> পেমেন্ট: {activeReceipt.paymentStatus}
            </span>
          </div>

          {/* Action buttons on receipt */}
          <div className="mt-4 pt-3 border-t border-[#c0d6c4] flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onOpenPaymentForReceipt(activeReceipt)}
              className="w-full bg-[#126353] hover:bg-[#0c473b] text-white py-2.5 px-3 rounded text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              data-testid="button-receipt-pay-now"
            >
              <CreditCard size={15} />
              <span>টাকা পাঠান ও TrxID দিন (bKash/Nagad)</span>
            </button>

            <button
              type="button"
              onClick={() => onTrackReceipt(activeReceipt)}
              className="w-full bg-[#f4f7f2] hover:bg-[#e4ede1] text-[#176a59] border border-[#bcd2c0] py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles size={13} />
              <span>লাইভ স্ট্যাটাস ট্র্যাক করুন</span>
            </button>
          </div>
        </section>
      )}
    </aside>
  );
};
