import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Library Management System</h1>
      <div className="welcome">
        <p>Welcome, {user?.name}!</p>
        <p>Role: <strong>{user?.role}</strong></p>
      </div>
      <div className="dashboard-grid">
        <Link to="/books" className="dashboard-card">
          <h2>Books</h2>
          <p>Manage library books</p>
        </Link>
        <Link to="/authors" className="dashboard-card">
          <h2>Authors</h2>
          <p>Manage authors</p>
        </Link>
        <Link to="/categories" className="dashboard-card">
          <h2>Categories</h2>
          <p>Manage book categories</p>
        </Link>
      </div>
    </div>
  );
};

