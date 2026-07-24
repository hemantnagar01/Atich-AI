import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Hexagon, Layers, LayoutTemplate, Database, Cloud, ShieldAlert, Route, Lightbulb, Link2, ArrowRight } from 'lucide-react';
import { AnimationTest } from './AnimationTest';
import { BorderRotate } from './BorderRotate';

const nodesData = [
  { id: 0, label: "Vision", icon: <Lightbulb className="w-5 h-5" />, hoverX: 250, hoverY: 70, idleX: 180, idleY: 380 },
  { id: 1, label: "Architecture", icon: <LayoutTemplate className="w-5 h-5" />, hoverX: 377, hoverY: 123, idleX: 230, idleY: 410 },
  { id: 2, label: "Tech Stack", icon: <Layers className="w-5 h-5" />, hoverX: 430, hoverY: 250, idleX: 320, idleY: 390 },
  { id: 3, label: "Database", icon: <Database className="w-5 h-5" />, hoverX: 377, hoverY: 377, idleX: 190, idleY: 440 },
  { id: 4, label: "API Design", icon: <Link2 className="w-5 h-5" />, hoverX: 250, hoverY: 430, idleX: 250, idleY: 460 },
  { id: 5, label: "AWS Cloud", icon: <Cloud className="w-5 h-5" />, hoverX: 123, hoverY: 377, idleX: 310, idleY: 440 },
  { id: 6, label: "Risk Analysis", icon: <ShieldAlert className="w-5 h-5" />, hoverX: 70, hoverY: 250, idleX: 140, idleY: 410 },
  { id: 7, label: "Roadmap", icon: <Route className="w-5 h-5" />, hoverX: 123, hoverY: 123, idleX: 280, idleY: 360 },
];

interface WhatWeDoProps {
  onGetStartedClick?: () => void;
}

export const WhatWeDo: React.FC<WhatWeDoProps> = ({ onGetStartedClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full py-12 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center justify-center">
      
      <style>{`
        @keyframes flowDash {
          to {
            stroke-dashoffset: -16;
          }
        }
        .wire-path-idle {
          stroke: rgba(255, 255, 255, 0.08);
          stroke-width: 1.5;
          fill: none;
        }
        .wire-path-hover {
          stroke: #14b8a6;
          stroke-width: 2.5;
          stroke-dasharray: 8 8;
          animation: flowDash 0.8s linear infinite;
          filter: drop-shadow(0 0 6px rgba(20,184,166,0.6));
          fill: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10 w-full px-4 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
          
          {/* Left Side: Typography & Palette Card */}
          <div className="lg:col-span-5 flex justify-start w-full lg:-ml-4">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-[515px] h-[720px] mx-auto lg:ml-[-1rem] lg:mr-auto relative rounded-[40px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] group"
            >
              <BorderRotate
                backgroundColor="transparent"
                borderWidth={2}
                borderRadius={40}
                animationSpeed={4}
                className="w-full h-full shadow-[0_0_30px_rgba(45,212,191,0.05)] group-hover:shadow-[0_0_40px_rgba(45,212,191,0.15)] transition-shadow"
              >
                <div className="w-full h-full rounded-[38px] bg-gradient-to-b from-[#081514] via-[#0a1f1d] to-[#0c302b] flex flex-col items-center pt-6 pb-8 px-8 text-center overflow-hidden relative">
                  {/* Inner rim highlight */}
                  <div className="absolute inset-0 rounded-[38px] shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)] pointer-events-none z-20"></div>

                  <div className="relative z-10 w-full flex flex-col h-full pt-2 px-2 pb-2">
              
              {/* Title */}
              <h3 className="text-3xl font-bold text-white tracking-[0.2em] uppercase mb-8 text-center drop-shadow-[0_4px_12px_rgba(45,212,191,0.4)]" style={{ fontFamily: 'Times New Roman, serif' }}>
                User Flow
              </h3>
              
              <div className="flex-1 flex flex-col justify-between w-full relative">
                {/* Connecting Path SVG snaking through the cards */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ zIndex: 0 }}>
                  <path 
                    d="M 35 15 C 35 32, 65 28, 65 45 C 65 62, 38 58, 38 75 C 38 92, 75 88, 75 96" 
                    stroke="rgba(255,255,255,0.35)" 
                    strokeWidth="2" 
                    strokeDasharray="4 4" 
                    fill="none" 
                    vectorEffect="non-scaling-stroke" 
                  />
                </svg>

                {/* Step 1 */}
                <div className="flex justify-start w-full relative z-10 group">
                  <div className="w-[65%] p-3.5 rounded-[1.25rem] bg-white/5 backdrop-blur-xl text-left flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 transition-transform group-hover:scale-[1.02] overflow-hidden relative">
                    
                    {/* Vibrant glowing blobs behind glass */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-500/30 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>
                    
                    <div className="relative z-10 flex justify-between items-start w-full mb-2">
                      <div className="flex flex-col leading-tight">
                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">PHASE 01</span>
                        <span className="text-[9px] text-white/60 tracking-widest uppercase">ACCESS</span>
                      </div>
                      <span className="text-[9px] text-white/80 font-medium">Secure</span>
                    </div>

                    <div className="relative z-10 mb-2">
                      <h4 className="text-white font-bold text-lg leading-[1.1] tracking-tight">
                        Sign in to<br/>your workspace.
                      </h4>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[9px] text-white/60 font-medium tracking-wide">@atich-auth</span>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex justify-end w-full relative z-10 group">
                  <div className="w-[65%] p-3.5 rounded-[1.25rem] bg-white/5 backdrop-blur-xl text-left flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 transition-transform group-hover:scale-[1.02] overflow-hidden relative">
                    
                    {/* Vibrant glowing blobs behind glass */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/30 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>

                    <div className="relative z-10 flex justify-between items-start w-full mb-2">
                      <div className="flex flex-col leading-tight">
                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">PHASE 02</span>
                        <span className="text-[9px] text-white/60 tracking-widest uppercase">INPUT</span>
                      </div>
                      <span className="text-[9px] text-white/80 font-medium">AI Engine</span>
                    </div>

                    <div className="relative z-10 mb-2">
                      <h4 className="text-white font-bold text-lg leading-[1.1] tracking-tight">
                        Provide a<br/>one-line prompt.
                      </h4>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[9px] text-white/60 font-medium tracking-wide">@nlp-processing</span>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex justify-start w-full relative z-10 group">
                  <div className="w-[72%] p-3.5 rounded-[1.25rem] bg-white/5 backdrop-blur-xl text-left flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/20 transition-transform group-hover:scale-[1.02] overflow-hidden relative">
                    
                    {/* Vibrant glowing blobs behind glass */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-400/30 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>
                    <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-500/20 rounded-full blur-xl pointer-events-none transition-opacity group-hover:opacity-100 opacity-70"></div>

                    <div className="relative z-10 flex justify-between items-start w-full mb-2">
                      <div className="flex flex-col leading-tight">
                        <span className="text-[9px] font-bold text-white tracking-widest uppercase">PHASE 03</span>
                        <span className="text-[9px] text-white/60 tracking-widest uppercase">OUTPUT</span>
                      </div>
                      <span className="text-[9px] text-white/80 font-medium">Blueprint</span>
                    </div>

                    <div className="relative z-10 mb-2">
                      <h4 className="text-white font-bold text-lg leading-[1.1] tracking-tight">
                        Complete<br/>architecture ready.
                      </h4>
                    </div>

                    <div className="relative z-10">
                      <span className="text-[9px] text-white/60 font-medium tracking-wide">@system-design</span>
                    </div>
                  </div>
                </div>

                {/* Get Started Button (matching Hero section) */}
                <div className="flex justify-end w-full relative z-10 pt-2 pr-2">
                  <motion.div 
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={onGetStartedClick}
                    className="w-[150px] h-[46px] cursor-pointer rounded-full group"
                  >
                    <BorderRotate 
                      backgroundColor="rgba(10, 10, 10, 0.6)"
                      borderWidth={1}
                      borderRadius={50}
                      animationSpeed={3}
                      className="w-full h-full shadow-[0_0_20px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_30px_rgba(45,212,191,0.25)] transition-shadow"
                    >
                      <div className={`w-full h-full backdrop-blur-md rounded-full flex items-center justify-between p-1.5 ${isHovered ? 'flex-row-reverse' : 'flex-row'}`}>
                        <motion.span 
                          layout 
                          className={`font-medium text-[14px] text-white whitespace-nowrap ${isHovered ? 'mr-2' : 'ml-4'}`}
                        >
                          Get Started
                        </motion.span>
                        
                        <motion.div 
                          layout 
                          className="w-8 h-8 bg-accent-start rounded-full flex items-center justify-center shrink-0 shadow-sm"
                        >
                          <motion.div 
                            animate={{ rotate: isHovered ? 0 : -45 }} 
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                          >
                            <ArrowRight className="w-[14px] h-[14px] text-black/70" strokeWidth={2.5} />
                          </motion.div>
                        </motion.div>
                      </div>
                    </BorderRotate>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </BorderRotate>
      </motion.div>
    </div>

          {/* Right Side: Interactive Node Diagram (Blooming Flower) */}
          <div className="lg:col-span-7 flex flex-col justify-start items-center w-full lg:-mr-12 lg:pl-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 lg:mb-4 text-center"
            >
              From Idea to Production
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base md:text-lg text-white/60 mb-8 max-w-[450px] text-center font-medium"
            >
              Our intelligent engine instantly transforms your requirements into a fully structured, deployment-ready architecture blueprint.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="w-full flex justify-center lg:justify-end items-center"
            >
              <AnimationTest />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
