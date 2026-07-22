import React, { useState, useEffect } from 'react';
import { Hexagon } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const [phase, setPhase] = useState<'blank' | 'logo-enter' | 'logo-hold' | 'logo-exit' | 'doors-opening' | 'done'>('blank');

  useEffect(() => {
    // 0 -> 400ms: blank
    const t1 = setTimeout(() => setPhase('logo-enter'), 400);
    // 400ms -> 1600ms: logo fading in
    const t2 = setTimeout(() => setPhase('logo-hold'), 1600);
    // 1600ms -> 2200ms: logo holds
    const t3 = setTimeout(() => setPhase('logo-exit'), 2200);
    // 2200ms -> 2600ms: overlap fade out with doors opening
    const t4 = setTimeout(() => setPhase('doors-opening'), 2600);
    // 2600ms -> 3800ms: doors open
    const t5 = setTimeout(() => setPhase('done'), 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (phase === 'done') return null;

  const isLogoVisible = phase === 'logo-enter' || phase === 'logo-hold';
  const isLogoFadingOut = phase === 'logo-exit';
  const isOpening = phase === 'doors-opening';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden pointer-events-auto">
      
      {/* Upper Door */}
      <div 
        style={{
          transition: 'transform 1.2s cubic-bezier(0.83, 0, 0.17, 1)',
          transform: isOpening ? 'translateY(-100%)' : 'translateY(0)',
        }}
        className="relative w-full h-1/2 bg-background"
      >
        <div 
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-start/50 to-transparent transition-opacity duration-500" 
          style={{ opacity: isOpening ? 1 : 0 }}
        />
      </div>
      
      {/* Lower Door */}
      <div 
        style={{
          transition: 'transform 1.2s cubic-bezier(0.83, 0, 0.17, 1)',
          transform: isOpening ? 'translateY(100%)' : 'translateY(0)',
        }}
        className="relative w-full h-1/2 bg-background"
      >
        <div 
          className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-start/50 to-transparent transition-opacity duration-500"
          style={{ opacity: isOpening ? 1 : 0 }}
        />
      </div>

      {/* Premium Logo Wrapper */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div 
          style={{
            transition: 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1), filter 1.2s ease-out',
            opacity: isLogoVisible ? 1 : 0,
            transform: isLogoVisible ? 'scale(1)' : (isLogoFadingOut || isOpening ? 'scale(0.95)' : 'scale(1.1)'),
            filter: isLogoVisible ? 'blur(0px)' : 'blur(10px)',
          }}
          className="flex flex-col items-center justify-center gap-6"
        >
          {/* Logo with Soft Glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent-start rounded-full blur-[80px] opacity-30 mix-blend-screen animate-pulse" />
            <div className="relative w-20 h-20 rounded-[28px] bg-surface/40 border border-white/10 flex items-center justify-center backdrop-blur-2xl shadow-2xl">
              <Hexagon className="w-10 h-10 fill-accent-start text-accent-start" />
            </div>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Atich
          </h1>
        </div>
      </div>

    </div>
  );
};
