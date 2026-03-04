import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { useUserStore } from "./helpers/userStore";
import Headers from './pages/Headers.js';
import LoginRegister from './pages/LoginRegister'
import Menu from './pages/Menu'
import ClockInOut from './pages/ClockInOut';
import ManualInPut from './pages/ManualInPut';
import OverView from './pages/OverView';
import Edit from './pages/Edit';

function App() {
  const token = useUserStore((s) => s.token);
  return (  
    <>     
      <Headers />
      <div className="main-content">
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/loginregister" element={<LoginRegister />} />

        <Route path="/menu" element={token ? <Menu /> : <Navigate to="/" />} />
        <Route path="/clockinout" element={token ? <ClockInOut /> : <Navigate to="/" />} />
        <Route path="/manualinput" element={token ? <ManualInPut /> : <Navigate to="/" />} />
        <Route path="/overview" element={token ? <OverView /> : <Navigate to="/" />} />
        <Route path="/edit/:date" element={token ? <Edit /> : <Navigate to="/" />} />     
      </Routes>
      </div>
    </>
  );
}

export default App
