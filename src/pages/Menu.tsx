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
    <div className="menu">
          <div className="menu-btn">
            <Link to="/clockinout">
              <button className="menu-button">Stämpla In/Ut</button>
            </Link>
            <Link to="/manualinput">
              <button className="menu-button">Manuell Inmatning</button>
            </Link>
            <Link to="/overview">
              <button className="menu-button">Översikt</button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;