import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import DashboardParrocchia from './pages/DashboardParrocchia';
import InserimentoBilancio from './pages/InserimentoBilancio';
import GestioneDiocesi from './pages/GestioneDiocesi';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="d-flex">
        {/* Sidebar visibile solo dopo login */}
        <PrivateRoute>
          <Sidebar />
        </PrivateRoute>

        <div className="flex-grow-1">
          {/* Header sempre visibile */}
          <Header />

          <div className="p-3">
            <Routes>
              {/* Pubblico */}
              <Route path="/login" element={<Login />} />

              {/* Protetto: Parrocchia */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardParrocchia />
                  </PrivateRoute>
                }
              />
              <Route
                path="/inserimento"
                element={
                  <PrivateRoute>
                    <InserimentoBilancio />
                  </PrivateRoute>
                }
              />

              {/* Protetto: Diocesi */}
              <Route
                path="/diocesi"
                element={
                  <PrivateRoute>
                    <GestioneDiocesi />
                  </PrivateRoute>
                }
              />

              {/* Default */}
              <Route path="*" element={<Login />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;