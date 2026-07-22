import React from 'react';
import { ChevronUp, Hexagon } from 'lucide-react';
import { BeamsBackground } from './BeamsBackground';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-transparent pt-24 pb-8 px-4 md:px-8 lg:px-16 overflow-hidden">
      
      {/* Background Component */}
      <div className="absolute inset-0 z-0 opacity-50">
        <BeamsBackground />
      </div>
      
      {/* Top Part: 4 Columns (From Screenshot 2) */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-8 mb-16 md:mb-24 relative z-10">
        
        {/* Col 1: Logo & Socials */}
        <div className="flex flex-col gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-start rounded-lg flex items-center justify-center transform rotate-12">
              <Hexagon className="w-6 h-6 text-white transform -rotate-12" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Atich</span>
          </div>
          
          <div className="flex items-center gap-4 text-white">
            <a href="#" className="hover:text-accent-start transition-colors" title="Youtube">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
            </a>
            <a href="#" className="hover:text-accent-start transition-colors" title="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="hover:text-accent-start transition-colors" title="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="hover:text-accent-start transition-colors" title="Discord">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10c0-1-1.5-2-3-2H11c-1.5 0-3 1-3 2v4c0 1 1.5 2 3 2h2c1.5 0 3-1 3-2v-4z"/><circle cx="10.5" cy="12" r="1"/><circle cx="13.5" cy="12" r="1"/><path d="M6 10V8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v2"/><path d="M6 14v2c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-2"/></svg>
            </a>
          </div>
        </div>

        {/* Col 2: Spacer */}
        <div className="hidden md:block w-full md:w-auto flex-1"></div>

        {/* Col 3: ABOUT (Moved to where Company was) */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">About</h4>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Support</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Pricing and Refund</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Terms and Condition</a>
        </div>

        {/* Col 4: CONTACT */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Contact</h4>
          <p className="text-sm text-text-secondary">Online: 10am - 10pm <span className="text-white">+91 9071433205</span></p>
          <p className="text-sm text-text-secondary">Offline: 11am - 8pm <span className="text-white">+91 9691778470</span></p>
          <a href="mailto:hello@atich.ai" className="text-sm text-text-secondary hover:text-white transition-colors">hello@atich.ai</a>
          <p className="text-sm text-text-secondary max-w-[200px]">23-B, Sector C Indrapuri, Bhopal (MP), 462023</p>
        </div>
      </div>

      {/* Middle Part: Massive Typography (From Screenshot 1) */}
      <div className="w-full relative z-10 mb-8 flex justify-center overflow-visible">
        <h1 
          className="text-[22vw] md:text-[250px] lg:text-[280px] font-bold leading-none tracking-tighter text-transparent bg-clip-text select-none text-center w-full"
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 10%, rgba(255,255,255,0.0) 90%)',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            letterSpacing: '-0.05em'
          }}
        >
          atich.ai
        </h1>
      </div>

      {/* Bottom Part: Copyright & Back to Top (From Screenshot 1) */}
      <div className="max-w-7xl mx-auto border-t border-border/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-xs text-text-secondary">
          © 2026 <span className="font-semibold text-white">Atich</span>. All Right Reserved
        </p>
        <button 
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs text-text-secondary hover:text-white transition-colors group"
        >
          Back to Top
          <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-accent-start group-hover:border-accent-start transition-all">
            <ChevronUp className="w-4 h-4 text-white" />
          </div>
        </button>
      </div>
      
    </footer>
  );
};
