import '../styles/LoginRegister.css';

function LoginRegister() {

  return (
        <div>
            <h1>Välkommen till WorkTimly!</h1>
            <h3>Logga in eller registrera dig för att starta igång resan med WorkTimly</h3>
          
           <div className="reg-container">
            <h1>Logga In / Registrera</h1>
            <p>Användarnamn</p>
            <input className='user-input'
            placeholder='Användarnamn'
            />
            <p>Lösenord</p>
            <input className='password-input'
            placeholder='Lösenord'
            />
            <div className='reg-buttons'>
                <button>Registrera</button>
                <button>Logga In</button>
            </div>
           </div>
        </div> 
  );
}

export default LoginRegister;