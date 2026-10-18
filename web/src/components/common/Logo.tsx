'use client';

import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  symbolOnly?: boolean;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'light',
  className = '',
  symbolOnly = false,
  showTagline = false,
}) => {
  const isDarkTheme = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none cursor-pointer group ${className}`}>
      {/* Stylized Tunease Audio Symbol with Reactive Glow */}
      <div className="relative flex items-center justify-center w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5A00] via-[#FF7A00] to-[#FF9E00] shadow-lg shadow-[#FF5A00]/30 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-[#FF5A00]/50">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white drop-shadow-sm"
        >
          <path
            d="M5 6H19M12 6V17C12 18.6569 10.6569 20 9 20C7.34315 20 6 18.6569 6 17C6 15.3431 7.34315 14 9 14C10 14 10.9 14.4 11.5 15"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="16.5" cy="11.5" r="1.5" fill="currentColor" />
        </svg>

        {/* Ambient pulse dot */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9E00] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF5A00]" />
        </span>
      </div>

      {!symbolOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tighter text-xl italic ${
                isDarkTheme ? 'text-neutral-900' : 'text-white'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              TUNEASE
            </span>
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 font-mono">
              FLAC
            </span>
          </div>
          {showTagline && (
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
              Music's Social Media
            </span>
          )}
        </div>
      )}
    </div>
  );
};
