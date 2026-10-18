'use client';

import React, { use } from 'react';
import { PlaylistView } from '../../../../components/player/PlaylistView';

interface PlaylistPageProps {
  params: Promise<{ id: string }>;
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
  const resolvedParams = use(params);
  return <PlaylistView playlistId={resolvedParams.id} />;
}
