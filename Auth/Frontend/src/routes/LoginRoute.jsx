import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { LogIn, UserPlus } from 'lucide-react';
import { AUTH_ROUTES } from './routes.config';

const MUSIC_APP_URL = import.meta.env.VITE_MUSIC_APP_URL || 'https://tunease-music-player-zzde.vercel.app';

function getPostLoginDestination() {
  const configuredMusicUrl = new URL(MUSIC_APP_URL);
  const requestedUrl = new URLSearchParams(window.location.search).get('returnTo');
  if (requestedUrl) {
    try {
      const requested = new URL(requestedUrl);
      if (requested.origin === configuredMusicUrl.origin) return new URL('/', requested.origin);
    } catch {
      // Ignore malformed or untrusted return URLs.
    }
  }
  return new URL('/', configuredMusicUrl.origin);
}

export function LoginRoute({ apiBaseUrl, onLoginSuccess }) {
  const navigate = useNavigate();

  return (
    <>
      {/* Route Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 mb-6">
        <button
          type="button"
          onClick={() => navigate(AUTH_ROUTES.LOGIN.path)}
          className="py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer bg-[#FF5A00] text-white shadow-lg shadow-[#FF5A00]/30"
        >
          <LogIn className="w-3.5 h-3.5" />
          Sign In
        </button>
        <button
          type="button"
          onClick={() => navigate(AUTH_ROUTES.REGISTER.path)}
          className="py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer text-neutral-400 hover:text-white"
        >
          <UserPlus className="w-3.5 h-3.5" />
          Register
        </button>
      </div>

      <LoginForm
        apiBaseUrl={apiBaseUrl}
        onSuccess={(user, accessToken) => {
          onLoginSuccess(user, accessToken);
          const destination = getPostLoginDestination();
          if (accessToken) destination.hash = new URLSearchParams({ access_token: accessToken }).toString();
          window.location.replace(destination.toString());
        }}
        onSwitchToRegister={() => navigate(AUTH_ROUTES.REGISTER.path)}
      />
    </>
  );
}
