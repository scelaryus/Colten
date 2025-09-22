import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

interface NavItem {
  name: string;
  path: string;
  icon?: string;
}

export const Navigation: React.FC = () => {
  const { isOwner, isTenant, logout, getUserDisplayName } = useAuth();
  const location = useLocation();

  const ownerNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Buildings', path: '/buildings' },
    { name: 'Units', path: '/units' },
    { name: 'Tenants', path: '/tenants' },
    { name: 'Issues', path: '/issues' },
    { name: 'Payments', path: '/payments' },
  ];

  const tenantNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Unit', path: '/my-unit' },
    { name: 'Issues', path: '/issues' },
    { name: 'Payments', path: '/payments' },
    { name: 'Profile', path: '/profile' },
  ];

  const navItems = isTenant() ? tenantNavItems : ownerNavItems;

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="premium-nav">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/dashboard" className="nav-logo-link">
              <div className="nav-logo-icon">C</div>
              <span className="nav-logo-text">Colten</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <ul className="nav-links-list">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Menu */}
          <div className="nav-user-menu">
            <span className="nav-user-name">
              {getUserDisplayName()}
            </span>
            <button
              onClick={logout}
              className="nav-logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="nav-mobile">
        <div className="nav-mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-mobile-link ${isActivePath(item.path) ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
