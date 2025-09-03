// src/pages/DashboardDiocesi.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DashboardDiocesi = () => {
  const [bilanci, setBilanci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anno, setAnno] = useState('2024');

  useEffect(() => {
    const fetchBilanci = async () => {
      try {
        const response = await api.get(`/bilanci/bilanci/?anno=${anno}`);
        setBilanci(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilanci();
  }, [anno]);

  const approva = async (id) => {
    await api.post(`/bilanci/bilanci/${id}/approva/`);
    setBilanci(bilanci.map(b => b.id === id ? { ...b, stato: 'approvato' } : b));
    alert("✅ Bilancio approvato");
  };

  const esporta = async (id) => {
    const response = await api.get(`/bilanci/bilanci/${id}/export_excel/`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `consuntivo_${id}.xlsx`);
    document.body.appendChild(link);
    link.click();
  };

  if (loading) return <div>Caricamento bilanci diocesani...</div>;

  return (
    <div className="p-4">
      <h2>🏛️ Dashboard Ufficio Economato - Anno {anno}</h2>
      <select
        value={anno}
        onChange={(e) => setAnno(e.target.value)}
        className="form-select w-auto mb-4"
      >
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Parrocchia</th>
            <th>Comune</th>
            <th>Entrate</th>
            <th>Uscite</th>
            <th>Contributo</th>
            <th>Stato</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {bilanci.map(b => (
            <tr key={b.id}>
              <td>{b.parrocchia?.nome}</td>
              <td>{b.parrocchia?.comune}</td>
              <td>€ {b.totale_entrate.toFixed(2)}</td>
              <td>€ {b.totale_uscite.toFixed(2)}</td>
              <td>€ {b.totale_contributo.toFixed(2)}</td>
              <td>
                <span className={`badge ${
                  b.stato === 'approvato' ? 'bg-success' :
                  b.stato === 'inviato' ? 'bg-warning text-dark' : 'bg-secondary'
                }`}>
                  {b.stato}
                </span>
              </td>
              <td>
                {b.stato === 'inviato' && (
                  <button className="btn btn-sm btn-success me-1" onClick={() => approva(b.id)}>
                    ✅ Approva
                  </button>
                )}
                <button className="btn btn-sm btn-info" onClick={() => esporta(b.id)}>
                    📥 Excel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardDiocesi;