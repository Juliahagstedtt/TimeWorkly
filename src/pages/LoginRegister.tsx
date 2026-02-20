import '../styles/LoginRegister.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../helpers/userStore';

function LoginRegister() {

  const navigate = useNavigate();
  const setUser = useUserStore((s) => s.setUser); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleRegister = async () => {
    setErrorMessage("");

    if (username.length < 5) {
    setErrorMessage("Användarnamnet måste vara minst 5 tecken.");
    return;
    }

    if (password.length < 6) {
    setErrorMessage("Lösenordet måste vara minst 6 tecken.");
    return;
    }

    try {
      const res = await fetch('http://localhost:10000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

      if (res.ok) {
        localStorage.setItem("jwt", data.token); 
        setUser({ token: data.token, userId: data.userId, username });
        navigate('/menu');
      } else {
        setErrorMessage(data.error);
      }
    } catch (err) {
      setErrorMessage("Något gick fel, försök igen");
    }
  };

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const res = await fetch('http://localhost:10000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

        const text = await res.text();
        const data = text ? JSON.parse(text) : null;

      if (res.ok) {
          localStorage.setItem("jwt", data.token);
        setUser({ token: data.token, userId: data.userId, username: data.username ?? username });
        navigate('/menu');
      } else {
        setErrorMessage(data.error);
      }
    } catch (err) {
      setErrorMessage("Något gick fel, försök igen");
    }
  };


  return (
        <div>
            <h1>Välkommen till WorkTimly!</h1>
            <h3>Logga in eller registrera dig för att starta igång resan med WorkTimly</h3>
          
           <div className="reg-container">
            <h1>Logga In / Registrera</h1>
            <p>Användarnamn</p>
            <input className='user-input'
            placeholder='Användarnamn'
            value={username}
            onChange={e => setUsername(e.target.value)}
            />
            <p>Lösenord</p>
            <input className='password-input'
            placeholder='Lösenord'
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)} />
            {errorMessage && <p className="error">{errorMessage}</p>}

            <div className='buttons-container'>
                <button className='reg-buttons' onClick={handleRegister}>Registrera</button>
                <button className='reg-buttons' onClick={handleLogin}>Logga In</button>
            </div>
           </div>
        </div> 
  );
}

export default LoginRegister;