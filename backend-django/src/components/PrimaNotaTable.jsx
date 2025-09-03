// src/components/PrimaNotaTable.jsx
import React from 'react';

const PrimaNotaTable = ({ title, data, onAdd, onDelete, tipo }) => {
  return (
    <div className="mb-4">
      <h5>{title}</h5>
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
          {data.map((item, index) => (
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
                  onClick={() => onDelete(tipo, index)}
                >
                  ❌
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="6" className="text-end"><strong>Totale {title}:</strong></td>
            <td>
              <strong>
                € {data.reduce((sum, i) => sum + parseFloat(i.importo), 0).toFixed(2)}
              </strong>
            </td>
            <td>
              <button className="btn btn-sm btn-success" onClick={onAdd}>
                ➕ Aggiungi
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PrimaNotaTable;