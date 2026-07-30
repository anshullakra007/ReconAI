import React, { useState } from 'react';
import { HelpCircle, X, ChevronRight, ChevronLeft } from 'lucide-react';

const ConceptHoverboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "1. The Problem",
      desc: "Companies process millions of transactions a day. Sometimes, the internal database drops a payment, but the bank gateway still charges the customer. This mismatch loses companies millions of dollars.",
      img: "/scene_1.png"
    },
    {
      title: "2. The Old Way",
      desc: "Human analysts spend their entire weekends downloading massive CSV spreadsheets and comparing rows one-by-one to find where the numbers drift.",
      img: "/scene_2.png"
    },
    {
      title: "3. The ReconAI Way",
      desc: "This app automatically cross-references both systems in real-time. It flags the exact anomalous transactions and uses a Local LLM to analyze the root cause.",
      img: "/scene_3.png"
    }
  ];

  const handleNext = () => setStep(s => Math.min(s + 1, slides.length - 1));
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setStep(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      
      {/* The Floating Button */}
      <button 
        onClick={handleToggle}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl transition-all duration-300 ${isOpen ? 'bg-zinc-800 text-white scale-95 opacity-0 pointer-events-none absolute' : 'bg-white text-black hover:bg-zinc-100 hover:scale-105'}`}
      >
        <HelpCircle size={20} className="text-rose-500" />
        <span className="font-bold text-sm">See how it works</span>
      </button>

      {/* The Expanded Board */}
      <div 
        className={`absolute bottom-0 right-0 w-[350px] md:w-[450px] bg-[#0a0a0a] border border-zinc-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col ${isOpen ? 'scale-100 opacity-100' : 'scale-50 opacity-0 pointer-events-none'}`}
      >
        <div className="p-4 border-b border-zinc-800 bg-[#111] flex items-center justify-between z-10">
          <div className="flex items-center gap-2 text-zinc-100 font-medium">
            <HelpCircle size={16} className="text-rose-500" /> 
            What exactly does this app do?
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        
        {/* Slideshow Container */}
        <div className="relative bg-[#111] overflow-hidden" style={{ height: '350px' }}>
           {slides.map((slide, i) => (
             <div 
               key={i}
               className="absolute inset-0 w-full h-full flex flex-col transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(${(i - step) * 100}%)` }}
             >
                <div className="w-full h-48 bg-zinc-900 border-b border-zinc-800 overflow-hidden relative">
                   <img src={slide.img} alt={slide.title} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                   {/* Gradient overlay to blend image into background */}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center">
                   <h3 className="text-zinc-100 text-lg font-bold mb-2">{slide.title}</h3>
                   <p className="text-zinc-400 text-sm leading-relaxed">{slide.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Controls Footer */}
        <div className="p-4 flex items-center justify-between border-t border-zinc-800 bg-[#0a0a0a]">
          
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-rose-500' : 'w-1.5 bg-zinc-700'}`}></div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrev}
              disabled={step === 0}
              className={`p-2 rounded-full border border-zinc-800 flex items-center justify-center transition-colors ${step === 0 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'}`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {step < slides.length - 1 ? (
              <button 
                onClick={handleNext}
                className="bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-rose-500 text-white hover:bg-rose-600 px-4 py-2 rounded-full text-sm font-bold transition-colors"
              >
                Finish
              </button>
            )}
          </div>

        </div>
      </div>
      
    </div>
  );
};

export default ConceptHoverboard;
