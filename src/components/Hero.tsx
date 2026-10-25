import React from 'react';
import { Gamepad2, ArrowUpRight, Zap, Shield, Clock } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="intro-grid" aria-labelledby="hero-heading">
      <div className="intro-copy rise-in">
        <div className="eyebrow">
          <span className="eyebrow-line"></span> গেম টপ-আপ, সহজ করে
        </div>

        <h1 id="hero-heading">
          আপনার পরের
          <br />
          <span>গেমিং মোমেন্ট</span>
          <br />
          এখান থেকেই।
        </h1>

        <p className="intro-description">
          গেম বেছে নিন, প্যাকেজ ঠিক করুন, আর আপনার Player ID দিয়ে অর্ডার তৈরি করুন।
          কোনো লুকানো ধাপ নেই। বিকাশ ও নগদে সহজে পেমেন্ট করুন।
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <a href="#games" className="hero-link font-display text-base" data-testid="link-start-order">
            অর্ডার শুরু করুন <ArrowUpRight size={17} />
          </a>

          <div className="flex items-center gap-3 text-xs text-[#52655b] bg-[#faf8f088] px-3 py-1.5 rounded-full border border-[#d2dcd0]">
            <span className="inline-flex items-center gap-1 text-[#176a59] font-medium">
              <Zap size={13} /> ৫-১৫ মিনিটে
            </span>
            <span className="text-[#a8b3aa]">•</span>
            <span className="inline-flex items-center gap-1 text-[#176a59] font-medium">
              <Shield size={13} /> ১০০% নিরাপদ UID
            </span>
          </div>
        </div>
      </div>

      <div className="hero-art" aria-label="গেমিং এবং টপ-আপের ইলাস্ট্রেশন">
        <div className="art-orbit orbit-one"></div>
        <div className="art-orbit orbit-two"></div>

        <div className="art-stamp font-mono">
          PLAY
          <br />
          YOUR
          <br />
          NEXT
        </div>

        <div className="art-cross cross-one">+</div>
        <div className="art-cross cross-two">+</div>

        <div className="art-core">
          <Gamepad2 size={76} strokeWidth={1.2} />
        </div>

        <div className="art-ticket">
          <span>ZONE / 01</span>
          <strong>
            READY
            <br />
            WHEN
            <br />
            YOU ARE
          </strong>
          <ArrowUpRight size={22} />
        </div>

        <span className="art-caption font-mono">BD / DIGITAL GOODS</span>
      </div>

      <div className="intro-note">
        <span className="note-number font-mono">01—04</span>
        <span className="font-medium text-[#2d493f]">জনপ্রিয় গেম, এক জায়গায় — Free Fire, PUBG, Mobile Legends & FC Mobile</span>
        <span className="note-rule"></span>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#6e7d77]">
          <Clock size={12} /> ২৪/৭ অর্ডার গ্রহণ
        </span>
      </div>
    </section>
  );
};
