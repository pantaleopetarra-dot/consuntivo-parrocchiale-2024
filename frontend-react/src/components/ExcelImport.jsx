// src/components/ExcelImport.jsx
import React, { useState } from 'react';
import api from '../services/api';

const ExcelImport = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Seleziona un file Excel da importare.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/bilanci/bilanci/1/importa_excel/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.dettagli) {
        const messaggi = response.data.dettagli.join('\n');
        alert(`✅ Importazione completata:\n${messaggi}`);
        if (onImportSuccess) onImportSuccess();
      } else {
        alert('Importazione completata con successo!');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Errore durante l\'importazione.';
      setError(`❌ Errore: ${msg}`);
      console.error('Errore importazione Excel:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5>📥 Importa da Excel</h5>
        <p className="text-muted">
          Carica un file Excel compilato con il modello ufficiale. I dati verranno inseriti automaticamente.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="form-control mb-2"
            disabled={loading}
          />
          <button type="submit" className="btn btn-info" disabled={loading}>
            {loading ? 'Caricamento...' : 'Importa Excel'}
          </button>
        </form>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
    </div>
  );
};

export default ExcelImport;