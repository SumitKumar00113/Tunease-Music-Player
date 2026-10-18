'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/landing/Navbar';
import { Footer } from '../../components/landing/Footer';
import { WaitlistModal } from '../../components/landing/WaitlistModal';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F5F5] flex flex-col">
      <Navbar onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <main className="flex-1 w-full pt-16">
        {children}
      </main>
      <Footer onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
