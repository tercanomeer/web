import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRoleValues } from '../types';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {isAuthenticated && (
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Library System
            </Link>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/books">Books</Link>
              <Link to="/authors">Authors</Link>
              <Link to="/categories">Categories</Link>
              <Link to="/borrows">Borrows</Link>
              {user?.role === UserRoleValues.ADMIN && (
                <Link to="/users">Users</Link>
              )}
            </div>
            <div className="nav-user">
              <span>{user?.name} ({user?.role})</span>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="main-content">{children}</main>
    </div>
  );
};

