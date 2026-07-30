import React from 'react';

const InfoTooltip = ({ text, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-zinc-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-zinc-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-zinc-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-zinc-800'
  };

  return (
    <div className="relative group inline-block ml-1.5 cursor-help align-middle">
      <span className="text-zinc-400 hover:text-white text-[9px] border border-zinc-700 bg-zinc-800 rounded-full w-3.5 h-3.5 inline-flex items-center justify-center font-bold transition-colors">
        ?
      </span>
      <div className={`absolute ${positionClasses[position]} w-48 p-2.5 bg-zinc-800 text-zinc-200 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-[100] shadow-xl border border-zinc-700 text-center font-medium leading-relaxed`}>
        {text}
        <div className={`absolute border-[5px] border-transparent ${arrowClasses[position]}`}></div>
      </div>
    </div>
  );
};

export default InfoTooltip;
