import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import { DiscoverRoute } from './DiscoverRoute';
import { ExploreRoute } from './ExploreRoute';
import { LibraryRoute } from './LibraryRoute';
import { LikedRoute } from './LikedRoute';
import { PlaylistRoute } from './PlaylistRoute';
import { ArtistRoute } from './ArtistRoute';
import { DashboardRoute } from './DashboardRoute';
import { MUSIC_ROUTES } from './routes.config';
import UserDashboard from './UserDashboard';



export function AppRoutes() {
  const location = useLocation();
  const { setActiveTab } = usePlayer();

  // Keep PlayerContext activeTab in sync with current URL route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '/discover') {
      setActiveTab('discover');
    } else if (path.startsWith('/explore')) {
      setActiveTab('explore');
    } else if (path.startsWith('/library')) {
      setActiveTab('library');
    } else if (path.startsWith('/liked')) {
      setActiveTab('liked');
    } else if (path.startsWith('/playlist')) {
      setActiveTab('playlist');
    } else if (path.startsWith('/artist')) {
      setActiveTab('artist');
    } else if (path.startsWith('/dashboard')) {
      setActiveTab('dashboard');
    } else if (path.startsWith('/user_dashboard')) {
      setActiveTab("user_dashboard")
    }
  }, [location.pathname, setActiveTab]);

  return (
    <Routes>
      <Route path={MUSIC_ROUTES.DISCOVER.path} element={<DiscoverRoute />} />
      <Route path={MUSIC_ROUTES.DISCOVER.alias} element={<DiscoverRoute />} />
      <Route path={MUSIC_ROUTES.EXPLORE.path} element={<ExploreRoute />} />
      <Route path={MUSIC_ROUTES.LIBRARY.path} element={<LibraryRoute />} />
      <Route path={MUSIC_ROUTES.LIKED.path} element={<LikedRoute />} />
      <Route path={MUSIC_ROUTES.PLAYLIST.path} element={<PlaylistRoute />} />
      <Route path={MUSIC_ROUTES.ARTIST.path} element={<ArtistRoute />} />
      <Route path={`${MUSIC_ROUTES.DASHBOARD.path}/*`} element={<DashboardRoute />} />
<Route path={MUSIC_ROUTES.USER_DASHBOARD.path}element={<UserDashboard/>} />
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
