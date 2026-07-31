import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ title, subtitle, actions }) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <Link className="app-brand" to={user?.role === 'student' ? '/dashboard' : '/admin/dashboard'}>
        <span className="brand-mark">MH</span>
        <span>Mastery Hub</span>
      </Link>
      <div className="app-header-main">
        <p>{subtitle}</p>
        <h1>{title}</h1>
      </div>
      <div className="app-header-actions">
        {actions}
        <button type="button" className="button-secondary" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
