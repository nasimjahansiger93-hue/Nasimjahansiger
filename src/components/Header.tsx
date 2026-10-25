import React from 'react';
import { Gamepad2, ArrowDownRight, Search, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeaderProps {
  onOpenTracker: () => void;
  onOpenPaymentGuide: () => void;
  onOpenAdmin: () => void;
  ordersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTracker,
  onOpenPaymentGuide,
  onOpenAdmin,
  ordersCount = 0
}) => {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a href="/" className="brand" data-testid="link-home" aria-label="TopUp Zone BD হোম">
          <span className="brand-symbol">
            <Gamepad2 size={22} strokeWidth={2.2} />
          </span>
          <span className="brand-copy">
            <span className="brand-name font-display">
              TOPUP<span>ZONE</span> <span className="text-[#126353] font-mono text-xs">BD</span>
            </span>
            <span className="brand-locale">বাংলাদেশ গেমারদের জন্য</span>
          </span>
        </a>

        <div className="header-right">
          <span className="open-indicator hidden sm:inline-flex">
            <i /> অর্ডার নেওয়া হচ্ছে
          </span>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={onOpenTracker}
              className="text-[#155e51] hover:text-[#e66a3a] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-[#e7eee3] transition-colors"
              data-testid="link-track-order"
            >
              <Search size={14} />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            <button
              type="button"
              onClick={onOpenPaymentGuide}
              className="text-[#155e51] hover:text-[#e66a3a] text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded hover:bg-[#e7eee3] transition-colors"
              data-testid="link-payment-guide"
            >
              <HelpCircle size={14} />
              <span className="hidden md:inline">পেমেন্ট গাইড</span>
            </button>

            <button
              type="button"
              onClick={onOpenAdmin}
              className="text-[#596c66] hover:text-[#17382f] text-xs font-mono inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#eceae0] hover:bg-[#e0ddd1] transition-colors"
              title="ম্যানেজমেন্ট / অর্ডার লিস্ট"
              data-testid="button-admin-toggle"
            >
              <ShieldCheck size={14} className="text-[#176a59]" />
              <span className="hidden sm:inline">অর্ডারস</span>
              {ordersCount > 0 && (
                <span className="bg-[#176a59] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {ordersCount}
                </span>
              )}
            </button>

            <a
              href="#games"
              className="header-jump hidden md:inline-flex"
              data-testid="link-browse-games"
            >
              গেম দেখুন <ArrowDownRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
