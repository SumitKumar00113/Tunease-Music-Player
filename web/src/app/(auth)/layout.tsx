'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '../../components/common/Logo';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#060608] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glowing orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#FF5A00]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FFA000]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top back navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Tunease</span>
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-md my-8">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Logo variant="light" className="scale-110" />
          </Link>
        </div>

        <div className="bg-[#0E0E11]/90 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
