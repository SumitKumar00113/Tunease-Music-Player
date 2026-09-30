import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2 select-none cursor-pointer ${className}`}>
      {/* Brand Icon: Dynamic Vinyl / Soundwave Badge */}
      <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF5A00] via-[#FF7A00] to-[#FFA000] p-[1.5px] shadow-lg shadow-[#FF5A00]/25 flex items-center justify-center group">
        <div className="w-full h-full bg-[#0A0A0C] rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-95">
          <div className="relative flex items-center gap-[2px]">
            <span className="w-[3px] h-3.5 bg-[#FF5A00] rounded-full animate-pulse" />
            <span className="w-[3px] h-5 bg-white rounded-full animate-pulse delay-100" />
            <span className="w-[3px] h-2.5 bg-[#FF8A00] rounded-full animate-pulse delay-200" />
          </div>
        </div>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-white font-['Outfit']">
        Tune<span className="text-[#FF5A00]">ase</span>
      </span>
    </div>
  );
};
