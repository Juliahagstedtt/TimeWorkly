// import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import LoginRegister from './pages/LoginRegister'
import Headers from './pages/Headers';

function App() {
  return (
    <>     
      <Headers />
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/logginregister" element={<LoginRegister />} />
      </Routes>
    </>
  );
}

export default App
