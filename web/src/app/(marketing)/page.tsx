'use client';

import React, { useState } from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { ValueCardsSection } from '../../components/landing/ValueCardsSection';
import { FeatureCarouselSection } from '../../components/landing/FeatureCarouselSection';
import { ExperienceSection } from '../../components/landing/ExperienceSection';
import { DifferenceSection } from '../../components/landing/DifferenceSection';
import { CreatorSection } from '../../components/landing/CreatorSection';
import { SocialProofSection } from '../../components/landing/SocialProofSection';
import { WaitlistModal } from '../../components/landing/WaitlistModal';

export default function HomePage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-2 sm:px-4 space-y-12">
      <HeroSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <ValueCardsSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <FeatureCarouselSection onOpenWaitlist={() => setIsWaitlistOpen(true)} />
      <ExperienceSection />
      <DifferenceSection />
      <CreatorSection />
      <SocialProofSection />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
    </div>
  );
}
