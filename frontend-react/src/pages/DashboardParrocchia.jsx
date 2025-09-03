// src/pages/DashboardParrocchia.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DashboardParrocchia = () => {
  const [bilancio, setBilancio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilancio = async () => {
      try {
        const response = await api.get('/bilanci/bilanci/?anno=2024');
        if (response.data.length > 0) {
          setBilancio(response.data[0]);
        }
      } catch (err) {
        console.error('Errore nel recupero del bilancio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilancio();
  }, []);

  if (loading) return <div>Caricamento dashboard...</div>;

  return (
    <div className="p-4">
      <h2>Benvenuto, Parrocchia!</h2>
      <p>
        Compila il <strong>Consuntivo Parrocchiale 2024</strong> entro il <strong>31 marzo 2025</strong>.
      </p>

      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📝 Prima Nota</h5>
              <p className="card-text">
                Compila entrate e uscite mensili con codici contabili.
              </p>
              <Link to="/inserimento" className="btn btn-primary">
                Vai alla Compilazione
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">📊 Stato Bilancio</h5>
              <p>
                <strong>Stato:</strong>{' '}
                <span className={`badge ${
                  bilancio?.stato === 'approvato' ? 'bg-success' :
                  bilancio?.stato === 'inviato' ? 'bg-warning text-dark' : 'bg-secondary'
                }`}>
                  {bilancio?.stato || 'bozza'}
                </span>
              </p>
              <p>
                <strong>Totale entrate:</strong> € {bilancio?.totale_entrate?.toFixed(2) || '0.00'}
              </p>
              <p>
                <strong>Totale uscite:</strong> € {bilancio?.totale_uscite?.toFixed(2) || '0.00'}
              </p>
              <p>
                <strong>Contributo diocesano:</strong> € {bilancio?.totale_contributo?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="alert alert-info">
          <strong>Suggerimento:</strong> Puoi importare un file Excel già compilato nella sezione "Compila Bilancio".
        </div>
      </div>
    </div>
  );
};

export default DashboardParrocchia;