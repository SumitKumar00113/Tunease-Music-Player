import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../components/UserProfile';
import { AUTH_ROUTES } from './routes.config';

export function ProfileRoute({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();

  if (!user) {
    navigate(AUTH_ROUTES.LOGIN.path);
    return null;
  }

  const handleLogoutAndRedirect = async () => {
    await onLogout();
    navigate(AUTH_ROUTES.LOGIN.path);
  };

  return (
    <UserProfile
      user={user}
      onLogout={handleLogoutAndRedirect}
      onUpdateUser={onUpdateUser}
    />
  );
}
