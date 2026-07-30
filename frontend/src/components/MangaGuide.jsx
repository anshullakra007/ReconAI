import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MangaGuide({ children, actionText, description, position = 'top' }) {
  const [isHovered, setIsHovered] = useState(false);

  // Position offsets for the guide panel
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-4 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-4 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-4 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-4 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div 
      className="relative inline-block w-full md:w-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: position === 'top' ? 20 : position === 'bottom' ? -20 : 0, x: position === 'left' ? 20 : position === 'right' ? -20 : 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className={`absolute z-50 pointer-events-none ${getPositionClasses()}`}
          >
            {/* Cyber-Manga Action Panel */}
            <div className="relative overflow-hidden bg-black/90 backdrop-blur-xl px-5 py-2.5 border border-cyan-500/50 shadow-[4px_4px_0px_0px_rgba(34,211,238,0.4)] -skew-x-6">
              {/* Glowing Action Lines */}
              <div 
                className="absolute inset-0 opacity-10 mix-blend-screen"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #22d3ee 2px, #22d3ee 4px)'
                }}
              />
              
              {/* Bold, kinetic text */}
              <div className="relative">
                <span className="block whitespace-nowrap text-white font-black text-sm uppercase tracking-wider italic drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  {actionText}
                </span>
                {description && (
                  <span className="block text-cyan-100/70 font-medium text-xs mt-0.5 max-w-[200px] whitespace-normal leading-tight">
                    {description}
                  </span>
                )}
              </div>
              
              {/* Decorative Cyber Star */}
              <div className="absolute top-1 right-2 text-cyan-400 text-xs animate-pulse font-black">✦</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
