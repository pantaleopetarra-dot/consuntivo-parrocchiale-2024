// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary text-white p-3 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Consuntivo Parrocchiale 2024</h4>
        <button className="btn btn-light btn-sm" onClick={handleLogout}>
          Esci
        </button>
      </div>
    </header>
  );
};

export default Header;