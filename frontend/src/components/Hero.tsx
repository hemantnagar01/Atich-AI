import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { BeamsBackground } from './BeamsBackground';
import { BorderRotate } from './BorderRotate';

interface HeroProps {
  onStart: (name: string, description: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Track if this is the very first load to sync with the loading screen
  const isFirstLoad = useRef(false);
  
  useEffect(() => {
    if (!sessionStorage.getItem('heroLoaded')) {
      isFirstLoad.current = true;
      sessionStorage.setItem('heroLoaded', 'true');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      onStart(name, description);
    }
  };

  const animationDelay = isFirstLoad.current ? 3.0 : 0;

  return (
    <BeamsBackground intensity="medium">
      <div className="z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-8 px-6">
        <motion.h2 
          className="text-5xl md:text-6xl font-bold tracking-tighter max-w-2xl leading-tight text-white drop-shadow-xl"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, delay: animationDelay, ease: [0.25, 1, 0.5, 1] }}
        >
          From an idea to a <span className="text-gradient">production architecture</span> in seconds.
        </motion.h2>
        
        <motion.p 
          className="text-lg text-white/70 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: animationDelay + 0.3, ease: 'easeOut' }}
        >
          Enter a one-line description of your project. We'll generate a complete, structured technical blueprint ready for execution.
        </motion.p>

        <motion.form 
          onSubmit={handleSubmit} 
          className="w-full mt-8 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: animationDelay + 0.5, ease: 'easeOut' }}
        >
          <BorderRotate 
            backgroundColor="#0a0a0a"
            borderWidth={1}
            borderRadius={16}
            animationSpeed={4}
            className="max-w-2xl mx-auto shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full"
          >
            <div className="backdrop-blur-xl p-2 flex flex-col md:flex-row gap-2 w-full h-full rounded-2xl">
            <input 
              type="text" 
              placeholder="Project Name (e.g. TaskMaster)" 
              className="bg-transparent border-none outline-none px-4 py-3 text-white placeholder-white/40 md:w-1/3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <div className="hidden md:block w-px bg-white/10 my-2"></div>
            <input 
              type="text" 
              placeholder="What does it do?" 
              className="bg-transparent border-none outline-none px-4 py-3 text-white placeholder-white/40 flex-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <button 
              type="submit" 
              className="bg-gradient-to-r from-accent-start to-accent-end hover:opacity-90 text-white font-medium px-6 py-3 rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(var(--accent-start),0.3)] hover:shadow-[0_0_30px_rgba(var(--accent-start),0.5)]"
            >
              Start <ArrowRight className="w-4 h-4 ml-2" />
            </button>
            </div>
          </BorderRotate>
        </motion.form>
      </div>
    </BeamsBackground>
  );
};
