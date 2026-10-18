'use client';

import React from 'react';
import { DifferenceSection } from '../../../components/landing/DifferenceSection';
import { SocialProofSection } from '../../../components/landing/SocialProofSection';

export default function DifferencePage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <DifferenceSection />
      <SocialProofSection />
    </div>
  );
}
