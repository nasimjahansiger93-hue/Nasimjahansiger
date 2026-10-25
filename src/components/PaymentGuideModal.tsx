import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, PhoneCall, HelpCircle } from 'lucide-react';
import { PAYMENT_METHODS } from '../data/catalog';

interface PaymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentGuideModal: React.FC<PaymentGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, number: string) => {
    const plain = number.replace(/[^0-9]/g, '');
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
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="bg-[#faf8f0] border border-[#d2ded1] rounded-lg shadow-2xl max-w-lg w-full overflow-hidden rise-in max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        {/* Header */}
        <div className="bg-[#126353] text-[#fbf6ea] p-4 px-5 flex justify-between items-center">
          <div>
            <div className="text-[11px] font-mono text-[#d6ede4] uppercase tracking-wider">
              সাহায্য ও নির্দেশনা
            </div>
            <h3 id="guide-modal-title" className="text-lg font-bold font-display leading-tight">
              পেমেন্ট ও টপ-আপ নির্দেশিকা
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

        <div className="p-5 overflow-y-auto space-y-5 text-[#213b32]">
          {/* Numbers box */}
          <div className="bg-white border border-[#deded3] rounded-md p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-bold text-[#144f43] uppercase tracking-wider">
                আমাদের অফিসিয়াল পেমেন্ট নম্বরসমূহ:
              </h4>
              <span className="text-[10px] text-[#126353] bg-[#eaf1e8] font-bold px-2 py-0.5 rounded">
                ১-ক্লিক কপি
              </span>
            </div>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <div
                  key={pm.id}
                  className="flex items-center justify-between p-2.5 rounded bg-[#f7f9f5] border border-[#e4ece2] hover:border-[#126353]/40 transition-colors"
                >
                  <div>
                    <span className="text-xs font-bold block text-[#1b3a30]">{pm.name}</span>
                    <span className="text-[10px] text-[#6d7e76]">{pm.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#126353] select-all">
                      {pm.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(pm.id, pm.number)}
                      className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 transition-all ${
                        copiedId === pm.id
                          ? 'bg-[#166534] text-white'
                          : 'bg-[#126353] hover:bg-[#0c473b] text-white'
                      }`}
                      title={`${pm.name} নম্বর কপি করুন`}
                    >
                      {copiedId === pm.id ? (
                        <>
                          <CheckCircle2 size={12} />
                          <span>কপি!</span>
                        </>
                      ) : (
                        <span>কপি</span>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#687a71]">
              * সতর্কবার্তা: শুধুমাত্র উপরের নম্বরেই (<b>01778796778</b>) লেনদেন করুন। কোনো ভুয়া নম্বর বা কল গ্রহণ করবেন না।
            </p>
          </div>

          {/* Step by step */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#144f43] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#126353]" />
              টপ-আপ করার ৩টি সহজ ধাপ:
            </h4>

            <div className="space-y-2.5 text-xs text-[#384e45]">
              <div className="p-3 bg-white rounded border border-[#e2e2d8]">
                <strong className="block text-[#176a59] font-semibold mb-0.5">
                  ১. গেম ও প্যাকেজ সিলেক্ট করুন:
                </strong>
                আপনার পছন্দের গেম নির্বাচন করে প্যাকেজের উপর ক্লিক করুন এবং আপনার সঠিক Player ID (UID) দিন।
              </div>

              <div className="p-3 bg-white rounded border border-[#e2e2d8]">
                <strong className="block text-[#176a59] font-semibold mb-0.5">
                  ২. বিকাশ বা নগদ থেকে টাকা পাঠান:
                </strong>
                আপনার মোবাইল ফাইন্যান্সিয়াল অ্যাপ থেকে 'Send Money' করে সঠিক টাকার পরিমাণ পাঠান।
              </div>

              <div className="p-3 bg-white rounded border border-[#e2e2d8]">
                <strong className="block text-[#176a59] font-semibold mb-0.5">
                  ৩. TrxID জমা দিন ও ডেলিভারি পান:
                </strong>
                টাকা পাঠানোর পর মেসেজের TrxID আমাদের অর্ডার ফর্ম বা পেমেন্ট অপশনে লিখে জমা দিন। ৫-১৫ মিনিটের মধ্যে আপনার গেমে ডায়মন্ড বা ইউসি যুক্ত হবে।
              </div>
            </div>
          </div>

          {/* Safety */}
          <div className="bg-[#eaf1e8] border border-[#bcd2c0] rounded p-3 text-xs flex items-start gap-2.5">
            <ShieldCheck size={20} className="text-[#176a59] flex-none mt-0.5" />
            <div>
              <strong className="text-[#126353] block font-semibold">
                ১০০% পাসওয়ার্ড-মুক্ত ও নিরাপদ
              </strong>
              <span className="text-[#4b6057] text-[11px]">
                আমরা কখনোই আপনার গেম অ্যাকাউন্টের পাসওয়ার্ড বা লগইন চাই না। শুধুমাত্র Player UID এর মাধ্যমে নিরাপদ অফিশিয়াল টপ-আপ প্রদান করা হয়।
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center pt-2 border-t border-[#deded3]">
            <span className="text-xs text-[#6e7d77] block mb-1">
              যেকোনো প্রয়োজনে আমাদের সরাসরি মেসেজ দিন:
            </span>
            <a
              href="https://wa.me/8801778796778"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#126353] bg-white border border-[#c6d7c8] px-3 py-1.5 rounded hover:bg-[#f2f7f1] transition-colors"
            >
              <PhoneCall size={13} />
              <span>WhatsApp: 01778-796778</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
