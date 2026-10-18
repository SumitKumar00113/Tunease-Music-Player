'use client';

import React, { use } from 'react';
import { ArtistView } from '../../../../components/player/ArtistView';

interface ArtistPageProps {
  params: Promise<{ id: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const resolvedParams = use(params);
  return <ArtistView artistId={resolvedParams.id} />;
}
