'use client';

import React from 'react';
import { FeatureCarouselSection } from '../../../components/landing/FeatureCarouselSection';
import { DifferenceSection } from '../../../components/landing/DifferenceSection';

export default function FeaturesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <FeatureCarouselSection />
      <DifferenceSection />
    </div>
  );
}
