import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomeRoute } from './HomeRoute';
import { ExperienceRoute } from './ExperienceRoute';
import { CreatorsRoute } from './CreatorsRoute';
import { FeaturesRoute } from './FeaturesRoute';
import { DifferenceRoute } from './DifferenceRoute';
import { LANDING_ROUTES } from './routes.config';

/**
 * AppRoutes Component
 * Declarative client-side routing tree for Tunease Landing Platform
 */
export function AppRoutes({ onOpenWaitlist, experienceRef }) {
  return (
    <Routes>
      <Route
        path={LANDING_ROUTES.HOME.path}
        element={
          <HomeRoute
            onOpenWaitlist={onOpenWaitlist}
            experienceRef={experienceRef}
          />
        }
      />
      <Route
        path={LANDING_ROUTES.EXPERIENCE.path}
        element={<ExperienceRoute onOpenWaitlist={onOpenWaitlist} />}
      />
      <Route
        path={LANDING_ROUTES.CREATORS.path}
        element={<CreatorsRoute onOpenWaitlist={onOpenWaitlist} />}
      />
      <Route
        path={LANDING_ROUTES.FEATURES.path}
        element={<FeaturesRoute onOpenWaitlist={onOpenWaitlist} />}
      />
      <Route
        path={LANDING_ROUTES.DIFFERENCE.path}
        element={<DifferenceRoute onOpenWaitlist={onOpenWaitlist} />}
      />
      <Route
        path={LANDING_ROUTES.WAITLIST.path}
        element={
          <HomeRoute
            onOpenWaitlist={onOpenWaitlist}
            experienceRef={experienceRef}
          />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
