import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { CreatorSection } from '../components/CreatorSection';
import { FeatureCarouselSection } from '../components/FeatureCarouselSection';
import { ValueCardsSection } from '../components/ValueCardsSection';
import { DifferenceSection } from '../components/DifferenceSection';
import { SocialProofSection } from '../components/SocialProofSection';
import { Footer } from '../components/Footer';

/**
 * HomeRoute Component
 * Comprehensive product journey overview containing all flagship modules
 */
export function HomeRoute({ onOpenWaitlist, experienceRef }) {
  return (
    <div className="space-y-0">
      {/* SECTION 1: HERO */}
      <HeroSection onOpenWaitlist={onOpenWaitlist} />

      {/* SECTION 2: EXPERIENCE MUSIC BEYOND THE SCREEN */}
      <div ref={experienceRef}>
        <ExperienceSection />
      </div>

      {/* SECTION 3: FOR CREATORS */}
      <CreatorSection />

      {/* SECTION 4: BUILT FOR PURE MUSIC DISCOVERY */}
      <FeatureCarouselSection onOpenWaitlist={onOpenWaitlist} />

      {/* SECTION 5: VALUE CARDS */}
      <ValueCardsSection onOpenWaitlist={onOpenWaitlist} />

      {/* SECTION 6: WHAT MAKES US DIFFERENT */}
      <DifferenceSection />

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <SocialProofSection />

      {/* FOOTER */}
      <Footer onOpenWaitlist={onOpenWaitlist} />
    </div>
  );
}
