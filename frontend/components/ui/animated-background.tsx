'use client';

import { motion } from 'framer-motion';

export const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/10 via-background to-background" />
      
      {/* Moving Grid Overlay */}
      <motion.div
        className="absolute inset-0 w-[200vw] h-[200vh] -top-[50vh] -left-[50vw]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 50%)',
        }}
        animate={{
          y: [0, 40],
        }}
        transition={{
          repeat: Infinity,
          duration: 3,
          ease: 'linear',
        }}
      />
    </div>
  );
};
