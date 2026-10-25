import React from 'react';
import { GameItem, GamePackage } from '../types';
import { Check, Info, Sparkles } from 'lucide-react';

interface PackageGridProps {
  game: GameItem;
  selectedPackageName: string;
  onSelectPackage: (pkg: GamePackage) => void;
}

export const PackageGrid: React.FC<PackageGridProps> = ({
  game,
  selectedPackageName,
  onSelectPackage
}) => {
  return (
    <div className="package-section">
      <div className="package-heading">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line"></span> প্যাকেজ নির্বাচন
          </div>
          <h3>
            {game.name} <span>/ {game.subtitle}</span>
          </h3>
        </div>
        <span className="package-hint">
          <Sparkles size={13} className="text-[#e66a3a]" />
          ক্লিক করে বাছাই করুন
        </span>
      </div>

      <div className="package-grid" data-testid="grid-packages">
        {game.packages.map((pkg, idx) => {
          const isActive = pkg.name === selectedPackageName;
          const seq = String(idx + 1).padStart(2, '0');

          return (
            <button
              key={pkg.id || pkg.name}
              type="button"
              className={`package-card ${isActive ? 'package-active' : ''}`}
              onClick={() => onSelectPackage(pkg)}
              aria-pressed={isActive}
              data-testid={`card-package-${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center justify-between">
                <span className="package-seq font-mono">{seq}</span>
                {pkg.popular && (
                  <span className="bg-[#e66a3a] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                    সেরা ডিল
                  </span>
                )}
                {pkg.bonus && !pkg.popular && (
                  <span className="bg-[#176a59] text-[#e8f6f1] text-[9px] font-medium px-1.5 py-0.5 rounded">
                    {pkg.bonus}
                  </span>
                )}
              </div>

              <strong>{pkg.name}</strong>

              <div className="package-price">
                <span>৳</span>
                {pkg.priceTaka.toLocaleString('en-BD')}
              </div>

              <div className="package-choice">
                {isActive ? (
                  <Check size={11} strokeWidth={3} />
                ) : (
                  <span></span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="package-footnote">
        <Info size={14} />
        <span>সব প্যাকেজের মূল্য বাংলাদেশী টাকায় (BDT) নির্ধারিত। কোনো অতিরিক্ত চার্জ নেই।</span>
      </div>
    </div>
  );
};
