// src/components/YearSelector.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const YearSelector = () => {
  const [year, setYear] = useState('2024');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const selected = e.target.value;
    setYear(selected);
    // In un sistema reale, potresti ricaricare i dati in base all'anno
    // Per ora, un semplice reload forza il refresh con nuovo anno
    window.location.reload();
  };

  return (
    <div className="mb-4">
      <label className="me-2"><strong>Anno:</strong></label>
      <select
        value={year}
        onChange={handleChange}
        className="form-select w-auto d-inline"
      >
        <option value="2023">2023</option>
        <option value="2024">2024</option>
        <option value="2025">2025</option>
      </select>
    </div>
  );
};

export default YearSelector;