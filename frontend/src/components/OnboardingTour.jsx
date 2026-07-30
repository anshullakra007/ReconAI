import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

const steps = [
  {
    target: 'tour-kpis',
    title: 'The Command Center',
    content: 'Get a high-level view of your reconciliation status. We track total volume, detected anomalies, and exactly how much revenue is at risk.',
    position: 'bottom',
  },
  {
    target: 'tour-charts',
    title: 'Spot Systemic Failures',
    content: 'This chart tracks anomalies over time. Look for spikes—they often indicate a systemic failure in a payment gateway or internal logic bug.',
    position: 'right',
  },
  {
    target: 'tour-ai',
    title: 'Unleash the LLM',
    content: 'Don\'t dig through logs manually. Click here to send the anomalous records to Gemini AI. It will diagnose the root cause and recommend a fix.',
    position: 'left',
  },
  {
    target: 'tour-table',
    title: 'Surgical Data Drilling',
    content: 'Filter exactly what you need. Search by ID, filter by Error Type (like Duplicates), and isolate currencies to find specific failures instantly.',
    position: 'top',
  }
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [targetRect, setTargetRect] = useState(null);

  useEffect(() => {
    if (!isActive) return;

    const updateRect = () => {
      const el = document.getElementById(steps[currentStep].target);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetRect(rect);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    // Slight delay to ensure DOM is painted
    const timeout = setTimeout(updateRect, 100);

    return () => {
      window.removeEventListener('resize', updateRect);
      clearTimeout(timeout);
    };
  }, [currentStep, isActive]);

  if (!isActive) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto">
      {/* Dimmed Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Spotlight Hole (SVG Mask approach is complex in React without specific libraries, 
          so we use a highlighted box overlay instead) */}
      {targetRect && (
        <motion.div
          initial={false}
          animate={{
            top: targetRect.top - 16,
            left: targetRect.left - 16,
            width: targetRect.width + 32,
            height: targetRect.height + 32,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute z-[101] border-2 border-cyan-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] pointer-events-none"
        />
      )}

      {/* Tour Tooltip */}
      {targetRect && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25, delay: 0.1 }}
          className="absolute z-[102] w-80 bg-slate-900 border border-slate-700 shadow-2xl rounded-xl overflow-hidden"
          style={{
            top: step.position === 'bottom' ? targetRect.bottom + 32 : 
                 step.position === 'top' ? targetRect.top - 200 :
                 targetRect.top,
            left: step.position === 'right' ? targetRect.right + 32 :
                  step.position === 'left' ? targetRect.left - 350 :
                  targetRect.left,
          }}
        >
          {/* Header */}
          <div className="bg-slate-800/50 px-5 py-3 border-b border-slate-700 flex justify-between items-center">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button onClick={() => setIsActive(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-5">
            <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              {step.content}
            </p>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setIsActive(false)}
                className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
              >
                Skip Tour
              </button>
              
              <button
                onClick={() => {
                  if (currentStep < steps.length - 1) {
                    setCurrentStep(c => c + 1);
                  } else {
                    setIsActive(false);
                  }
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                {currentStep < steps.length - 1 ? (
                  <>Next <ChevronRight size={16} /></>
                ) : (
                  <>Get Started <Check size={16} /></>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
