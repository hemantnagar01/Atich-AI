import React, { useState } from 'react';
import { ChevronUp, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const handleSocialClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setActiveTooltip(id);
    setTimeout(() => {
      setActiveTooltip((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialIcons = [
    { id: 'youtube', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg> },
    { id: 'instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg> },
    { id: 'facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { id: 'discord', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10c0-1-1.5-2-3-2H11c-1.5 0-3 1-3 2v4c0 1 1.5 2 3 2h2c1.5 0 3-1 3-2v-4z"/><circle cx="10.5" cy="12" r="1"/><circle cx="13.5" cy="12" r="1"/><path d="M6 10V8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v2"/><path d="M6 14v2c0 2.2 1.8 4 4 4h4c2.2 0 4-1.8 4-4v-2"/></svg> }
  ];

  return (
    <>
    <style>{`
      @keyframes sweep {
        0% { background-position: 200% center; }
        100% { background-position: -200% center; }
      }
      .text-sweep {
        background-size: 200% auto;
        animation: sweep 6s linear infinite;
      }
    `}</style>
    <footer className="relative bg-transparent pt-16 md:pt-24 pb-8 px-4 md:px-8 lg:px-16 overflow-hidden">
      
      {/* Background Component */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-accent-start/15 via-[#0A0A0F] to-[#0A0A0F]">
      </div>
      
      {/* Top Part: 2 Columns */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-8 mb-12 md:mb-24 relative z-10">
        
        {/* Col 1: Logo & Socials */}
        <div className="flex flex-col gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-start rounded-lg flex items-center justify-center transform rotate-12">
              <Hexagon className="w-6 h-6 text-white transform -rotate-12" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">Atich</span>
          </div>
          
          <div className="flex items-center gap-6 text-white">
            {socialIcons.map((social) => (
              <div key={social.id} className="relative">
                <a 
                  href="#" 
                  onClick={(e) => handleSocialClick(e, social.id)} 
                  className="hover:text-accent-start transition-colors block"
                  title="Coming soon..."
                >
                  {social.icon}
                </a>
                <AnimatePresence>
                  {activeTooltip === social.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{ opacity: 1, y: 0, x: '-50%' }}
                      exit={{ opacity: 0, y: 5, x: '-50%' }}
                      className="absolute bottom-full left-1/2 mb-2 px-2.5 py-1 bg-[#1A1A24] border border-white/10 rounded shadow-xl text-[11px] font-medium text-white/80 whitespace-nowrap z-50 pointer-events-none"
                    >
                      Coming soon...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Col 2: Spacer */}
        <div className="hidden sm:block flex-1"></div>


        {/* Col 3: CONTACT */}
        <div className="flex flex-col gap-4 w-full sm:w-auto">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Contact</h4>
          <p className="text-sm text-text-secondary">24x7 Available</p>
          <a href="mailto:hello@atich.ai" className="text-sm text-text-secondary hover:text-white transition-colors">hello@atich.ai</a>
          <p className="text-sm text-text-secondary max-w-[200px]">350 Fifth Avenue,<br/>New York, NY 10118</p>
        </div>
      </div>

      {/* Middle Part: Massive Typography (From Screenshot 1) */}
      <div className="w-full relative z-10 mb-8 flex justify-center items-center overflow-hidden">
        <h1 
          className="text-[17vw] sm:text-[22vw] md:text-[200px] lg:text-[280px] font-bold leading-none tracking-tighter text-transparent bg-clip-text select-none text-center w-full text-sweep"
          style={{
            backgroundImage: 'linear-gradient(110deg, rgb(100,100,100) 0%, rgb(100,100,100) 40%, rgb(255,255,255) 50%, rgb(100,100,100) 60%, rgb(100,100,100) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 90%)',
            maskImage: 'linear-gradient(to bottom, black 10%, transparent 90%)',
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
    </>
  );
};
