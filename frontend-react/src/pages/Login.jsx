// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
import '../App.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(email, password);

    if (result.success) {
      // Reindirizza in base al ruolo (simulato)
      if (email.includes('diocesi')) {
        navigate('/diocesi');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h5 className="text-center mb-4">Accedi al Sistema</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@diocesi.to.it"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary w-100">
            Accedi
          </button>
        </form>
        <small className="text-muted mt-3 text-center">
          Esempi:<br />
          Parrocchia: <code>sanlorenzo@diocesi.to.it</code><br />
          Diocesi: <code>economato@diocesi.to.it</code>
        </small>
      </div>
    </div>
  );
};

export default Login;