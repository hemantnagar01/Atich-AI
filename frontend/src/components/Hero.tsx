import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BeamsBackground } from './BeamsBackground';
import { BorderRotate } from './BorderRotate';
import { PromptView } from './PromptView';

interface HeroProps {
  onStart: (name: string, desc: string) => void;
}

// Module-level variable to track if the hero has rendered at least once during this JS session (page load).
// This ensures the animation delay happens on refresh (since LoadingScreen plays on refresh), 
// but NOT on client-side navigation back to the home page.
let hasHeroRenderedOnce = false;

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  const isFirstLoad = useRef(!hasHeroRenderedOnce);
  
  useEffect(() => {
    hasHeroRenderedOnce = true;
  }, []);

  // 3.0s makes the text start fading in exactly as the doors are fully opening
  const animationDelay = isFirstLoad.current ? 3.0 : 0;

  return (
    <BeamsBackground intensity="medium">
      <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center px-4 sm:px-6">
        <motion.h2 
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter max-w-2xl leading-tight text-white drop-shadow-xl mb-6"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: animationDelay, ease: [0.25, 1, 0.5, 1] }}
        >
          From an idea to a <span className="text-gradient">production architecture</span> in seconds.
        </motion.h2>
        
        <motion.p 
          className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-medium mb-6 sm:mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: animationDelay + 0.4, ease: 'easeOut' }}
        >
          Enter a one-line description of your project. We'll generate a complete, structured technical blueprint ready for execution.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: animationDelay + 0.5, ease: 'easeOut' }}
          className="flex justify-center w-full"
        >
          {/* 
          <motion.div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => navigate('/start')}
            className="w-[170px] h-[52px] cursor-pointer rounded-full group"
          >
            <BorderRotate 
              backgroundColor="rgba(10, 10, 10, 0.6)"
              borderWidth={1}
              borderRadius={50}
              animationSpeed={3}
              className="w-full h-full shadow-[0_0_20px_rgba(var(--accent-start),0.1)] group-hover:shadow-[0_0_30px_rgba(var(--accent-start),0.25)] transition-shadow"
            >
              <div className={`w-full h-full backdrop-blur-md rounded-full flex items-center justify-between p-1.5 ${isHovered ? 'flex-row-reverse' : 'flex-row'}`}>
                <motion.span 
                  layout 
                  className={`font-medium text-[15px] text-white whitespace-nowrap ${isHovered ? 'mr-3' : 'ml-4'}`}
                >
                  Get Started
                </motion.span>
                
                <motion.div 
                  layout 
                  className="w-9 h-9 bg-accent-start rounded-full flex items-center justify-center shrink-0 shadow-sm"
                >
                  <motion.div 
                    animate={{ rotate: isHovered ? 0 : -45 }} 
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ArrowRight className="w-4 h-4 text-black/70" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
              </div>
            </BorderRotate>
          </motion.div>
          */}
          <div className="w-full">
            <PromptView onStart={onStart} />
          </div>
        </motion.div>
      </div>
    </BeamsBackground>
  );
};
