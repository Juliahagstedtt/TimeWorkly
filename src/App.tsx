// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginRegister from './pages/LoginRegister'
import Headers from './pages/Headers';
import Menu from './pages/Menu'
import ClockInOut from './pages/ClockInOut';

function App() {
  return (
    <>     
      <Headers />
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/logginregister" element={<LoginRegister />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/clockinout" element={<ClockInOut />} />
      </Routes>
    </>
  );
}

export default App
