'use client';

import React from 'react';
import { CreatorSection } from '../../../components/landing/CreatorSection';
import { ValueCardsSection } from '../../../components/landing/ValueCardsSection';

export default function CreatorsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <CreatorSection />
      <ValueCardsSection />
    </div>
  );
}
