import React from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardView } from '../components/DashboardView';
import { usePlayer } from '../context/PlayerContext';

export function DashboardRoute() {
  const { user, isLoading } = usePlayer();
  if (isLoading) return <div className="py-10 text-center text-[#A0B0A5]" role="status">Loading your account…</div>;
  if (user?.role !== 'artist') return <Navigate to="/user_dashboard" replace />;

  return (
    <div className="animate-in fade-in duration-300">
      <DashboardView />
    </div>
  );
}
