import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginRoute } from './LoginRoute';
import { RegisterRoute } from './RegisterRoute';
import { ProfileRoute } from './ProfileRoute';
import { AUTH_ROUTES } from './routes.config';

const getPostLoginDestination = () => {
  const requestedUrl = new URLSearchParams(window.location.search).get('returnTo');
  const musicAppUrl = import.meta.env.VITE_MUSIC_APP_URL || 'https://tunease-music-service-latest.onrender.com';
  if (requestedUrl) {
    try {
      const destination = new URL(requestedUrl);
      if (destination.origin === new URL(musicAppUrl).origin) return destination.href;
    } catch {
      // Ignore malformed or untrusted return URLs and use the profile route.
    }
  }
  return AUTH_ROUTES.PROFILE.path;
};

function AuthenticatedRedirect({ authToken }) {
  const destination = getPostLoginDestination();
  useEffect(() => {
    if (/^https?:\/\//.test(destination)) {
      const target = new URL(destination);
      if (authToken) target.hash = new URLSearchParams({ access_token: authToken }).toString();
      window.location.replace(target.toString());
    }
  }, [destination, authToken]);
  return /^https?:\/\//.test(destination)
    ? <div className="py-16 text-center text-xs text-neutral-400">Opening Tunease…</div>
    : <Navigate to={destination} replace />;
}

export function AppRoutes({
  apiBaseUrl,
  user,
  authToken,
  checkingAuth,
  onLoginSuccess,
  onLogout,
  onUpdateUser,
}) {
  if (checkingAuth) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Root redirect: If authenticated go to Profile, else Login */}
      <Route
        path={AUTH_ROUTES.HOME.path}
        element={
          user ? (
            <AuthenticatedRedirect authToken={authToken} />
          ) : (
            <LoginRoute
              apiBaseUrl={apiBaseUrl}
              onLoginSuccess={onLoginSuccess}
            />
          )
        }
      />

      {/* Login Route */}
      <Route
        path={AUTH_ROUTES.LOGIN.path}
        element={
          user ? (
            <AuthenticatedRedirect authToken={authToken} />
          ) : (
            <LoginRoute
              apiBaseUrl={apiBaseUrl}
              onLoginSuccess={onLoginSuccess}
            />
          )
        }
      />

      {/* Register Route */}
      <Route
        path={AUTH_ROUTES.REGISTER.path}
        element={
          user ? (
            <Navigate to={AUTH_ROUTES.PROFILE.path} replace />
          ) : (
            <RegisterRoute
              apiBaseUrl={apiBaseUrl}
              onRegisterSuccess={onLoginSuccess}
            />
          )
        }
      />

      {/* Profile Routes */}
      <Route
        path={AUTH_ROUTES.PROFILE.path}
        element={
          user ? (
            <ProfileRoute
              user={user}
              authToken={authToken}
              onLogout={onLogout}
              onUpdateUser={onUpdateUser}
            />
          ) : (
            <Navigate to={AUTH_ROUTES.LOGIN.path} replace />
          )
        }
      />

      <Route
        path={AUTH_ROUTES.ME.path}
        element={<Navigate to={AUTH_ROUTES.PROFILE.path} replace />}
      />

      {/* Wildcard Fallback */}
      <Route
        path="*"
        element={<Navigate to={AUTH_ROUTES.HOME.path} replace />}
      />
    </Routes>
  );
}
