import React from 'react';
import { Navigate } from 'react-router-dom';
import TuneaseStudio from '../components/TuneaseStudio';
import { usePlayer } from '../context/PlayerContext';

export function DashboardRoute() {
  const { user, isLoading } = usePlayer();
  if (isLoading) return <div className="py-10 text-center text-[#A1A1AA]" role="status">Loading your account…</div>;
  if (user?.role !== 'artist') return <Navigate to="/user_dashboard" replace />;

  return <TuneaseStudio />;
}
