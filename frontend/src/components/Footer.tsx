import React from 'react';
import { Globe, Hash, MessageSquare, Tv, Radio, ChevronUp, Hexagon } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A0A0F] pt-24 pb-8 px-4 md:px-8 lg:px-16 border-t border-border/50 relative overflow-hidden">
      
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
            <a href="#" className="hover:text-accent-start transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent-start transition-colors"><Hash className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent-start transition-colors"><MessageSquare className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent-start transition-colors"><Tv className="w-5 h-5" /></a>
            <a href="#" className="hover:text-accent-start transition-colors"><Radio className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Col 2: ABOUT */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">About</h4>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">About Us</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Support</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Pricing and Refund</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Terms and Condition</a>
        </div>

        {/* Col 3: COMPANY */}
        <div className="flex flex-col gap-4 w-full md:w-auto">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Company</h4>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Architecture Check</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Hire Experts</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Discord Community</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Careers</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Submit Blueprints</a>
          <a href="#" className="text-sm text-text-secondary hover:text-white transition-colors">Feedback</a>
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
      <div className="max-w-7xl mx-auto w-full relative z-0 mb-8 flex justify-center overflow-hidden">
        <h1 
          className="text-[25vw] md:text-[220px] font-bold leading-none tracking-tighter text-transparent bg-clip-text select-none"
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
