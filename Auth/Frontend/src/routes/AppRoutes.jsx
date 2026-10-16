import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginRoute } from './LoginRoute';
import { RegisterRoute } from './RegisterRoute';
import { ProfileRoute } from './ProfileRoute';
import { AUTH_ROUTES } from './routes.config';

export function AppRoutes({
  apiBaseUrl,
  user,
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
            <Navigate to={AUTH_ROUTES.PROFILE.path} replace />
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
            <Navigate to={AUTH_ROUTES.PROFILE.path} replace />
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
