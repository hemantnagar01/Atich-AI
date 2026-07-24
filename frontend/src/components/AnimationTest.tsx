import React, { useEffect, useMemo } from 'react';
import { motion, useAnimate, useInView } from 'framer-motion';

export const AnimationTest: React.FC = () => {
  const [scope, animate] = useAnimate();
  const isInView = useInView(scope, { once: true, margin: "-100px" });
  const radius = 180;
  const numCircles = 8;
  const angleStep = 360 / numCircles;
  
  const labels = ["Vision", "Architecture", "Tech Stack", "Database Schema", "API Design", "Cloud Setup", "Risk Analysis", "Roadmap"];

  const peripherals = useMemo(() => {
    const items = [];
    for (let i = 0; i < numCircles; i++) {
      const angle = i * angleStep;
      const angleInRad = (angle * Math.PI) / 180;
      
      const x = Math.cos(angleInRad) * radius;
      const y = Math.sin(angleInRad) * radius;
      
      const randomOffset = Math.random() * 100 + 50; 
      const offsetX = x + (Math.cos(angleInRad) * randomOffset);
      const offsetY = y + (Math.sin(angleInRad) * randomOffset);
      
      const pushRadius = radius + 35;
      const pushX = Math.cos(angleInRad) * pushRadius - x;
      const pushY = Math.sin(angleInRad) * pushRadius - y;
      
      // Text positioning logic
      const textDist = 48; // increased gap
      const textStartDist = 32;
      const textX = x + Math.cos(angleInRad) * textDist;
      const textY = y + Math.sin(angleInRad) * textDist;
      const textStartX = x + Math.cos(angleInRad) * textStartDist;
      const textStartY = y + Math.sin(angleInRad) * textStartDist;
      
      let textAnchor: "start" | "middle" | "end" = "start";
      if (Math.abs(Math.cos(angleInRad)) < 0.1) textAnchor = "middle";
      else if (Math.cos(angleInRad) < 0) textAnchor = "end";

      items.push({ 
        id: i, 
        angle, 
        x, 
        y, 
        offsetX, 
        offsetY, 
        pushX,
        pushY,
        label: labels[i],
        textX,
        textY,
        textStartX,
        textStartY,
        textAnchor
      });
    }
    return items;
  }, [radius]);

  useEffect(() => {
    if (!isInView) return;

    let isMounted = true;

    const runSequence = async () => {
      // Reset state for loop (in case it's looping)
      animate(".ripple", { opacity: 0, scale: 0.8 }, { duration: 0 });
      peripherals.forEach(p => {
        animate(`.fill-dot-${p.id}`, { opacity: 0, scale: 0 }, { duration: 0 });
        animate(`.label-${p.id}`, { opacity: 0, x: p.textStartX, y: p.textStartY }, { duration: 0 });
      });
      animate("#spinner-group", { rotate: 0 }, { duration: 0 });
      peripherals.forEach((p) => {
        animate(`#peripheral-${p.id}`, { opacity: 0, x: p.offsetX, y: p.offsetY }, { duration: 0 });
      });
      animate("#left-line", { pathLength: 1 }, { duration: 0 });
      animate("#left-arm .corner-circle", { opacity: 1 }, { duration: 0 });
      
      // Distance to touch edges: radius - (centerNodeRadius + cornerNodeRadius) = 180 - (22 + 20) = 138
      const travelDist = radius - 42;
      
      // 1. Center moves right (touches edge)
      await animate("#center-node", { x: travelDist }, { duration: 0.5, ease: "easeInOut" });
      
      // 2. Right ripples pop out (don't await so we can move back sooner)
      animate("#right-ripple-1", { opacity: [1, 0], scale: [0.8, 1.3] }, { duration: 0.4, ease: "easeOut" });
      animate("#right-ripple-2", { opacity: [0.6, 0], scale: [0.8, 1.5] }, { duration: 0.5, ease: "easeOut", delay: 0.1 });
      
      await new Promise(r => setTimeout(r, 250)); // Fast bounce pause
      
      // 3. Center moves left
      await animate("#center-node", { x: -travelDist }, { duration: 0.8, ease: "easeInOut" });
      
      // 4. Left ripples pop out (don't await)
      animate("#left-ripple-1", { opacity: [1, 0], scale: [0.8, 1.3] }, { duration: 0.4, ease: "easeOut" });
      animate("#left-ripple-2", { opacity: [0.6, 0], scale: [0.8, 1.5] }, { duration: 0.5, ease: "easeOut", delay: 0.1 });
      
      await new Promise(r => setTimeout(r, 250)); // Fast bounce pause
      
      // 5. Center moves back to center
      await animate("#center-node", { x: 0 }, { duration: 0.5, ease: "easeInOut" });
      
      await new Promise(r => setTimeout(r, 150)); // Pause before spin
      
      // Exactly 1 rotation before the pause (0 to 360 degrees)
      const spinDuration = 1.4;
      const spinBeforePause = animate("#spinner-group", { rotate: [0, 360] }, { duration: spinDuration, ease: "linear" });
      
      // Fly in peripherals concurrently
      animate(".peripheral-circle", { opacity: 1, x: 0, y: 0 }, { duration: 1.0, ease: "easeOut" });
      
      // 12 o'clock is at 270 degrees (75% of the 360 degrees)
      const timeTo12 = spinDuration * 0.75;
      // From 12 o'clock (270) to 3 o'clock (360) is 90 degrees (25% of the total)
      const timeFrom12To3 = spinDuration * 0.25;
      
      // Left arm and its corner circle disappear between 12 and 3 o'clock
      animate("#left-line", { pathLength: 0 }, { duration: timeFrom12To3, ease: "linear", delay: timeTo12 });
      animate("#left-arm .corner-circle", { opacity: 0 }, { duration: timeFrom12To3, ease: "linear", delay: timeTo12 });
      
      await spinBeforePause;
      
      // Pause for a moment at 3 o'clock
      await new Promise(r => setTimeout(r, 200));
      
      // Sweep Fill Phase (360 to 720 degrees)
      const round3Duration = 1.6;
      const round3 = animate("#spinner-group", { rotate: [360, 720] }, { duration: round3Duration, ease: "linear" });
      
      peripherals.forEach((p) => {
         // The line sweeps starting from 3 o'clock (0 degrees).
         const crossTime = (p.angle / 360) * round3Duration;
         animate(`.fill-dot-${p.id}`, { opacity: 1, scale: [0.5, 1] }, { duration: 0.15, delay: crossTime });
         animate(`.label-${p.id}`, { opacity: 1, x: p.textX, y: p.textY }, { duration: 0.3, delay: crossTime, ease: "easeOut" });
      });
      
      await round3;
      
      // Morph into 3D Text!
      // 1. Hide the sweeping right arm
      animate("#right-line", { opacity: 0 }, { duration: 0.2 });
      animate("#right-arm .corner-circle", { opacity: 0 }, { duration: 0.2 });
      
      // 2. Shrink center circle & Explode 3D text
      animate("#center-circle", { scale: 0, opacity: 0 }, { duration: 0.3, ease: "backIn" });
      
      // Push peripherals outwards slightly to make room for the big text
      peripherals.forEach(p => {
        animate(`#peripheral-${p.id}`, { x: p.pushX, y: p.pushY }, { duration: 0.6, ease: "backOut" });
      });
      
      await animate("#big-3d-text", { opacity: 1, scale: [0, 1.2, 1] }, { duration: 0.6, ease: "backOut" });
      
      // End hold with the glorious 3D text and fully lit peripherals
      await new Promise(r => setTimeout(r, 1000));
      
      // Fade out everything to repeat
      if (isMounted) {
        animate("svg", { opacity: 0 }, { duration: 0.6 });
        await animate("#big-3d-text", { scale: 0, opacity: 0 }, { duration: 0.4, ease: "backIn", delay: 0.2 });
        
        // Reset everything instantly for the next loop
        animate("svg", { opacity: 1 }, { duration: 0 });
        animate("#center-circle", { scale: 1, opacity: 1 }, { duration: 0 });
        animate("#right-line", { opacity: 1 }, { duration: 0 });
        animate("#right-arm .corner-circle", { opacity: 1 }, { duration: 0 });
      }
    };

    const loop = async () => {
      await new Promise(r => setTimeout(r, 800)); // Wait for parent entry animation
      
      // If the page just loaded, wait for the Hero opening animations to finish (~4.5s total)
      const timeSinceLoad = performance.now();
      if (timeSinceLoad < 4500) {
        await new Promise(r => setTimeout(r, 4500 - timeSinceLoad));
      }

      while (isMounted) {
        await runSequence();
      }
    };
    loop();

    return () => { isMounted = false; };
  }, [animate, peripherals, isInView]);

  return (
    <div ref={scope} className="relative w-full max-w-[500px] lg:max-w-[600px] aspect-square mx-auto">
      {/* SVG Container */}
      <svg viewBox="-350 -350 700 700" className="absolute inset-0 w-full h-full overflow-visible">
        
        <defs>
          <linearGradient id="peripheral-text-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#cbd5e1" />
            <stop offset="42%" stopColor="#ffffff" />
            <stop offset="46%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Peripheral Circles */}
        {peripherals.map((p) => (
          <motion.g 
            key={p.id} 
            id={`peripheral-${p.id}`} 
            className="peripheral-circle" 
            initial={{ opacity: 0, x: p.offsetX, y: p.offsetY }}
          >
            <circle 
              cx={p.x} 
              cy={p.y} 
              r={20} 
              stroke="rgba(20,184,166,0.4)" 
              strokeWidth={2.5} 
              fill="transparent" 
            />
            <motion.circle 
              cx={p.x} 
              cy={p.y} 
              r={14} 
              fill="#2dd4bf" 
              className={`fill-dot-${p.id}`}
              initial={{ opacity: 0, scale: 0 }}
              style={{ filter: 'drop-shadow(0px 0px 8px rgba(45,212,191,0.8))' }}
            />
            <motion.text
              className={`label-${p.id}`}
              x={0}
              y={0}
              fill="url(#peripheral-text-gradient)"
              fontSize="16"
              fontFamily="Inter, sans-serif"
              fontWeight="800"
              letterSpacing="0.5"
              textAnchor={p.textAnchor}
              alignmentBaseline="middle"
              initial={{ opacity: 0, x: p.textStartX, y: p.textStartY }}
              style={{ filter: 'drop-shadow(0px 2px 5px rgba(0,0,0,0.8)) drop-shadow(0px 0px 10px rgba(45,212,191,0.4))' }}
            >
              {p.label}
            </motion.text>
          </motion.g>
        ))}

        {/* Rotating Spinner Group */}
        <motion.g id="spinner-group">
          
          {/* Left Arm (Line + Node + Ripples) */}
          <motion.g id="left-arm">
            <motion.path id="left-line" d={`M 0 0 L ${-radius + 20} 0`} stroke="#14b8a6" strokeWidth={2.5} initial={{ pathLength: 1 }} />
            
            {/* Ripples */}
            <motion.circle id="left-ripple-2" cx={-radius} cy={0} r={38} stroke="#2dd4bf" strokeWidth={1} fill="transparent" className="ripple" initial={{ opacity: 0, scale: 0.8 }} />
            <motion.circle id="left-ripple-1" cx={-radius} cy={0} r={29} stroke="#2dd4bf" strokeWidth={1.5} fill="transparent" className="ripple" initial={{ opacity: 0, scale: 0.8 }} />
            
            <circle cx={-radius} cy={0} r={20} stroke="#14b8a6" strokeWidth={2.5} fill="transparent" className="corner-circle" />
          </motion.g>

          {/* Right Arm (Line + Node + Ripples) */}
          <motion.g id="right-arm">
            <motion.path id="right-line" d={`M 0 0 L ${radius - 20} 0`} stroke="#14b8a6" strokeWidth={2.5} initial={{ pathLength: 1 }} />
            
            {/* Ripples */}
            <motion.circle id="right-ripple-2" cx={radius} cy={0} r={38} stroke="#2dd4bf" strokeWidth={1} fill="transparent" className="ripple" initial={{ opacity: 0, scale: 0.8 }} />
            <motion.circle id="right-ripple-1" cx={radius} cy={0} r={29} stroke="#2dd4bf" strokeWidth={1.5} fill="transparent" className="ripple" initial={{ opacity: 0, scale: 0.8 }} />
            
            <circle cx={radius} cy={0} r={20} stroke="#14b8a6" strokeWidth={2.5} fill="transparent" className="corner-circle" />
          </motion.g>

          {/* Center Glowing Node */}
          <motion.g id="center-node">
            <circle 
              id="center-circle"
              cx={0} 
              cy={0} 
              r={22} 
              fill="#2dd4bf" 
              style={{ filter: 'drop-shadow(0px 0px 20px rgba(45,212,191,1)) drop-shadow(0px 0px 40px rgba(45,212,191,0.7))' }} 
            />
          </motion.g>

        </motion.g>

      </svg>
      
      {/* 3D BluePrint Text Overlay */}
      <motion.div 
        id="big-3d-text"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
        initial={{ opacity: 0, scale: 0 }}
      >
        <motion.div 
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center"
        >
          <span 
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 35%, #ffffff 42%, #ffffff 46%, #94a3b8 50%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(1px 1px 0px #cbd5e1) drop-shadow(2px 2px 0px #94a3b8) drop-shadow(3px 3px 0px #475569) drop-shadow(0px 8px 15px rgba(0,0,0,0.8))'
            }}
          >
            Blue
          </span>
          <span 
            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight"
            style={{ 
              background: 'linear-gradient(135deg, #2dd4bf 0%, #0f766e 35%, #2dd4bf 42%, #2dd4bf 46%, #042f2e 50%, #14b8a6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(1px 1px 0px #0f766e) drop-shadow(2px 2px 0px #042f2e) drop-shadow(3px 3px 0px #022c22) drop-shadow(0px 8px 15px rgba(0,0,0,0.8))'
            }}
          >
            Print
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};
