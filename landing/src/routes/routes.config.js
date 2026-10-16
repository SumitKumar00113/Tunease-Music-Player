/**
 * Route metadata and configuration for Tunease Landing Platform
 */
export const LANDING_ROUTES = {
  HOME: {
    path: '/',
    name: 'Home',
    anchor: '#hero',
    badge: 'Main',
    description: 'Tunease main landing gateway showcasing the full product journey',
  },
  EXPERIENCE: {
    path: '/experience',
    name: 'Spatial Audio',
    anchor: '#experience',
    badge: 'Lossless 3D',
    description: 'Interactive high-fidelity audio engine and waveform visualizer',
  },
  CREATORS: {
    path: '/creators',
    name: 'For Creators',
    anchor: '#creators',
    badge: '98% Payout',
    description: 'Direct monetization, high royalty rates, and real-time streaming analytics',
  },
  FEATURES: {
    path: '/features',
    name: 'Platform Features',
    anchor: '#features',
    badge: 'FLAC Engine',
    description: 'Discover lossless streaming, smart playlisting, and community sync',
  },
  DIFFERENCE: {
    path: '/difference',
    name: 'Why Tunease',
    anchor: '#difference',
    badge: 'Vs Spotify',
    description: 'Comparison matrix against legacy streaming platforms',
  },
  WAITLIST: {
    path: '/waitlist',
    name: 'VIP Beta Waitlist',
    anchor: '#waitlist',
    badge: 'Invite Only',
    description: 'Exclusive early access portal for listeners and indie artists',
  },
};

export const ROUTES_LIST = Object.values(LANDING_ROUTES);
