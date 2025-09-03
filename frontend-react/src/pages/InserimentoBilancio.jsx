// src/pages/InserimentoBilancio.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ExcelImport from '../components/ExcelImport';
import YearSelector from '../components/YearSelector';
import ModalConferma from '../components/ModalConferma';

const InserimentoBilancio = () => {
  const [entrate, setEntrate] = useState([]);
  const [uscite, setUscite] = useState([]);
  const [bilancio, setBilancio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [anno, setAnno] = useState('2024');

  useEffect(() => {
    const fetchBilancio = async () => {
      try {
        const response = await api.get(`/bilanci/bilanci/?anno=${anno}`);
        if (response.data.length > 0) {
          const data = response.data[0];
          setBilancio(data);
          setEntrate(data.entrate || []);
          setUscite(data.uscite || []);
        } else {
          // Crea un nuovo bilancio vuoto (il backend lo crea al primo salvataggio)
          setBilancio(null);
          setEntrate([]);
          setUscite([]);
        }
      } catch (err) {
        console.error('Errore nel recupero del bilancio:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBilancio();
  }, [anno]);

  const handleAdd = (tipo) => {
    const newItem = {
      giorno: '',
      mese: '',
      codice: '',
      causale1: '',
      causale2: '',
      causale3: '',
      importo: ''
    };
    if (tipo === 'entrata') {
      setEntrate([...entrate, newItem]);
    } else {
      setUscite([...uscite, newItem]);
    }
  };

  const handleDelete = (tipo, index) => {
    if (tipo === 'entrata') {
      setEntrate(entrate.filter((_, i) => i !== index));
    } else {
      setUscite(uscite.filter((_, i) => i !== index));
    }
  };

  const handleSaveDraft = async () => {
    alert("Bozza salvata localmente (simulazione). In produzione, salva sul backend.");
  };

  const handleSend = async () => {
    if (!bilancio?.id) return;
    setShowModal(true);
  };

  const confirmSend = async () => {
    try {
      await api.post(`/bilanci/bilanci/${bilancio.id}/invia/`);
      alert("✅ Bilancio inviato all'Ufficio Economato!");
      setShowModal(false);
      window.location.reload();
    } catch (err) {
      alert("Errore nell'invio: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Caricamento bilancio...</div>;

  return (
    <div className="p-4">
      <h3>📝 Prima Nota - Bilancio {anno}</h3>
      <YearSelector />

      <ExcelImport onImportSuccess={() => window.location.reload()} />

      <h5>ENTRATE</h5>
      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th>Giorno</th>
            <th>Mese</th>
            <th>Codice*</th>
            <th>Causale 1</th>
            <th>Causale 2</th>
            <th>Causale 3</th>
            <th>Importo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {entrate.map((item, index) => (
            <tr key={index}>
              <td>{item.giorno || ''}</td>
              <td>{item.mese}</td>
              <td><strong>{item.codice}</strong></td>
              <td>{item.causale1}</td>
              <td>{item.causale2}</td>
              <td>{item.causale3}</td>
              <td>€ {parseFloat(item.importo).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete('entrata', index)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" className="text-end"><strong>Totale entrate:</strong></td>
            <td>
              <strong>
                € {entrate.reduce((sum, i) => sum + parseFloat(i.importo || 0), 0).toFixed(2)}
              </strong>
            </td>
            <td>
              <button className="btn btn-sm btn-success" onClick={() => handleAdd('entrata')}>
                ➕ Aggiungi
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <h5>USCITE</h5>
      <table className="table table-bordered table-sm">
        <thead className="table-light">
          <tr>
            <th>Giorno</th>
            <th>Mese</th>
            <th>Codice*</th>
            <th>Causale 1</th>
            <th>Causale 2</th>
            <th>Causale 3</th>
            <th>Importo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {uscite.map((item, index) => (
            <tr key={index}>
              <td>{item.giorno || ''}</td>
              <td>{item.mese}</td>
              <td><strong>{item.codice}</strong></td>
              <td>{item.causale1}</td>
              <td>{item.causale2}</td>
              <td>{item.causale3}</td>
              <td>€ {parseFloat(item.importo).toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete('uscita', index)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" className="text-end"><strong>Totale uscite:</strong></td>
            <td>
              <strong>
                € {uscite.reduce((sum, i) => sum + parseFloat(i.importo || 0), 0).toFixed(2)}
              </strong>
            </td>
            <td>
              <button className="btn btn-sm btn-success" onClick={() => handleAdd('uscita')}>
                ➕ Aggiungi
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4">
        <button className="btn btn-warning me-2" onClick={handleSaveDraft}>
          💾 Salva come Bozza
        </button>
        <button className="btn btn-success" onClick={handleSend}>
          📤 Invia a Diocesi
        </button>
      </div>

      <ModalConferma
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmSend}
        title="Invia Bilancio?"
        message={`Sei sicuro di voler inviare il bilancio ${anno} all'Ufficio Economato? Non potrai più modificarlo.`}
      />
    </div>
  );
};

export default InserimentoBilancio;