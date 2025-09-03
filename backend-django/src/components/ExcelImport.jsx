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
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError('');
    try {
      const response = await api.post(`/bilanci/bilanci/1/importa_excel/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(`✅ Importati: ${response.data.dettagli.join('\n')}`);
      if (onImportSuccess) onImportSuccess();
    } catch (err) {
      setError(`❌ Errore: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5>📥 Importa da Excel</h5>
        <p className="text-muted">Carica il tuo file Excel compilato. I dati verranno inseriti automaticamente.</p>
        <form onSubmit={handleSubmit}>
          <input type="file" accept=".xlsx" onChange={handleFileChange} className="form-control mb-2" required />
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