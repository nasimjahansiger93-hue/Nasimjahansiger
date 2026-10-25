import React from 'react';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTracker: () => void;
  onOpenGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracker,
  onOpenGuide,
  onOpenAdmin
}) => {
  return (
    <footer className="site-footer">
      <div className="shell flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        <a href="/" className="footer-brand" data-testid="link-footer-home">
          <span className="brand-symbol small">
            <Gamepad2 size={16} strokeWidth={2.2} />
          </span>
          <span className="font-display">
            TOPUPZONE<span> BD</span>
          </span>
        </a>

        <div className="flex items-center gap-4 text-xs text-[#707e77]">
          <button
            type="button"
            onClick={onOpenTracker}
            className="hover:text-[#176a59] transition-colors"
          >
            অর্ডার ট্র্যাক
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenGuide}
            className="hover:text-[#176a59] transition-colors"
          >
            পেমেন্ট গাইড
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="hover:text-[#176a59] transition-colors font-mono text-[11px]"
          >
            অ্যাডমিন
          </button>
        </div>

        <div className="text-center sm:text-right">
          <div className="text-xs text-[#52655b] font-medium">সহজ অর্ডার। পরিষ্কার শর্ত।</div>
          <div className="footer-code font-mono text-[10px] text-[#839188] mt-0.5">
            DHAKA / BANGLADESH
          </div>
        </div>
      </div>
    </footer>
  );
};
