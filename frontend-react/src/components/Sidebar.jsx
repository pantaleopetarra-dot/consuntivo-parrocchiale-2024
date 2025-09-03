// src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // Determina se l'utente è diocesi o parrocchia (es. dal percorso o da un contesto)
  const isDiocesi = location.pathname.startsWith('/diocesi');

  return (
    <div className="sidebar bg-light p-3" style={{ width: '220px', minHeight: '100vh' }}>
      <h6 className="text-primary">Navigazione</h6>
      <hr />

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            🏠 Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/inserimento"
            className={`nav-link ${location.pathname === '/inserimento' ? 'active' : ''}`}
          >
            📝 Compila Bilancio
          </Link>
        </li>
        {isDiocesi && (
          <li className="nav-item">
            <Link
              to="/diocesi"
              className={`nav-link ${location.pathname === '/diocesi' ? 'active' : ''}`}
            >
              🏛️ Ufficio Diocesano
            </Link>
          </li>
        )}
      </ul>

      <div className="mt-4 p-2 bg-white border rounded">
        <small>
          <strong>Consuntivo 2024</strong><br />
          Scadenza: <br />
          <span className="text-danger">31 marzo 2025</span>
        </small>
      </div>
    </div>
  );
};

export default Sidebar;