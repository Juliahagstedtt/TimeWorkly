// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Headers from './pages/Headers.js';
import LoginRegister from './pages/LoginRegister'
import Menu from './pages/Menu'
import ClockInOut from './pages/ClockInOut';
import ManualInPut from './pages/ManualInPut';
import OverView from './pages/OverView';
import MonthOverView from './pages/MonthOverview';

function App() {
  return (  
    <>     
      <Headers />
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/logginregister" element={<LoginRegister />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/clockinout" element={<ClockInOut />} />
        <Route path="/manualinput" element={<ManualInPut />} />
        <Route path="/overview" element={<OverView />} />
        <Route path="/monthoverview" element={<MonthOverView />} />
      </Routes>
    </>
  );
}

export default App
