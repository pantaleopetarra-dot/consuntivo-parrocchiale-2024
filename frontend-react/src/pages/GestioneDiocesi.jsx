// src/pages/GestioneDiocesi.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GestioneDiocesi = () => {
  const [bilanci, setBilanci] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anno, setAnno] = useState('2024');

  useEffect(() => {
    const fetchBilanci = async () => {
      try {
        const response = await api.get(`/bilanci/bilanci/?anno=${anno}`);
        setBilanci(response.data);
      } catch (err) {
        console.error('Errore nel recupero dei bilanci diocesani:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilanci();
  }, [anno]);

  const approva = async (id) => {
    try {
      await api.post(`/bilanci/bilanci/${id}/approva/`);
      setBilanci(
        bilanci.map((b) =>
          b.id === id ? { ...b, stato: 'approvato' } : b
        )
      );
      alert('✅ Bilancio approvato con successo');
    } catch (err) {
      alert('Errore nell\'approvazione: ' + (err.response?.data?.error || err.message));
    }
  };

  const esportaExcel = async (id) => {
    try {
      const response = await api.get(`/bilanci/bilanci/${id}/export_excel/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consuntivo_parrocchiale_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Errore nell\'esportazione: ' + err.message);
    }
  };

  if (loading) return <div>Caricamento bilanci diocesani...</div>;

  return (
    <div className="p-4">
      <h2>🏛️ Ufficio Economato Diocesano - Anno {anno}</h2>

      <div className="mb-4">
        <label className="me-2"><strong>Anno:</strong></label>
        <select
          value={anno}
          onChange={(e) => setAnno(e.target.value)}
          className="form-select w-auto d-inline"
        >
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
      </div>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
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
          {bilanci.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                Nessun bilancio inviato per l'anno {anno}
              </td>
            </tr>
          ) : (
            bilanci.map((b) => (
              <tr key={b.id}>
                <td>{b.parrocchia?.nome || 'N/D'}</td>
                <td>{b.parrocchia?.comune || 'N/D'}</td>
                <td>€ {b.totale_entrate?.toFixed(2) || '0.00'}</td>
                <td>€ {b.totale_uscite?.toFixed(2) || '0.00'}</td>
                <td>€ {b.totale_contributo?.toFixed(2) || '0.00'}</td>
                <td>
                  <span
                    className={`badge ${
                      b.stato === 'approvato'
                        ? 'bg-success'
                        : b.stato === 'inviato'
                        ? 'bg-warning text-dark'
                        : 'bg-secondary'
                    }`}
                  >
                    {b.stato}
                  </span>
                </td>
                <td>
                  {b.stato === 'inviato' && (
                    <button
                      className="btn btn-sm btn-success me-1"
                      onClick={() => approva(b.id)}
                    >
                      ✅ Approva
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => esportaExcel(b.id)}
                  >
                    📥 Excel
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 alert alert-light border">
        <h6>📌 Note per l’Ufficio Economato</h6>
        <ul>
          <li>Il contributo diocesano è calcolato automaticamente (2% su entrate ordinarie, 10% su affitti).</li>
          <li>Il file Excel esportato è conforme al modello ufficiale.</li>
          <li>È possibile approvare solo i bilanci nello stato "inviato".</li>
        </ul>
      </div>
    </div>
  );
};

export default GestioneDiocesi;