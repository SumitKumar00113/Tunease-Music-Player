import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { PlayerProvider } from '../context/PlayerContext';

export const metadata: Metadata = {
  title: 'Tunease — Your Music, Your Mood',
  description:
    'Experience sound that breathes with you. Stream, discover, and upload independent music with crystal clarity on Tunease.',
  keywords: ['music', 'streaming', 'audio player', 'artists', 'indie music', 'tunease'],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090909] text-[#F5F5F5] antialiased selection:bg-[#FF5A00] selection:text-white">
        <AuthProvider>
          <PlayerProvider>
            {children}
          </PlayerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
