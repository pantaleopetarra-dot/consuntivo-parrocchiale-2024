// src/pages/InserimentoBilancio.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PrimaNotaTable from '../components/PrimaNotaTable';
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
        const data = response.data[0];
        if (data) {
          setBilancio(data);
          setEntrate(data.entrate);
          setUscite(data.uscite);
        }
      } catch (err) {
        console.error(err);
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
    alert("Bozza salvata localmente (simulazione)");
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
      alert("Errore nell'invio: " + err.message);
    }
  };

  if (loading) return <div>Caricamento bilancio...</div>;

  return (
    <div className="p-4">
      <h3>📝 Prima Nota - Bilancio {anno}</h3>
      <YearSelector />

      <ExcelImport onImportSuccess={() => window.location.reload()} />

      <PrimaNotaTable
        title="ENTRATE"
        data={entrate}
        onAdd={() => handleAdd('entrata')}
        onDelete={handleDelete}
        tipo="entrata"
      />

      <PrimaNotaTable
        title="USCITE"
        data={uscite}
        onAdd={() => handleAdd('uscita')}
        onDelete={handleDelete}
        tipo="uscita"
      />

      <div className="mt-4">
        <button className="btn btn-warning me-2" onClick={handleSaveDraft}>
          💾 Salva come Bozza
        </button>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
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