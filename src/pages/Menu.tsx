import '../styles/menu.css'
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '../helpers/userStore';
import { useEffect } from 'react';


function Menu() {
  const navigate = useNavigate();
  const token = useUserStore((s) => s.token);
  const username = useUserStore((s) => s.username); 

  useEffect(() => {
    if (!token) {
      navigate("/"); 
    }
  }, [token, navigate]);

  if (!token) return null; 

  return (
    <div>
      <h1>Välkommen {username}!</h1> 
¨      <div className="menu">
        <h1>Meny</h1>
          <div className="menu-buttons">
            <Link to="/clockinout">
              <button className="menu-btn">Stämpla In/Ut</button>
            </Link>
            <Link to="/manualinput">
              <button className="menu-btn">Manuell Inmatning</button>
            </Link>
            <Link to="/overview">
              <button className="menu-btn">Översikt</button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;