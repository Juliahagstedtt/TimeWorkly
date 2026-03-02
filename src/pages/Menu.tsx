import '../styles/menu.css'
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '../helpers/userStore';
import { useEffect } from 'react';


function Menu() {
  const navigate = useNavigate();
  const token = useUserStore((s) => s.token);

  useEffect(() => {
    if (!token) {
      navigate("/"); 
    }
  }, [token, navigate]);

  if (!token) return null; 

  return (
    <div>
    <div className="menu">
          <div className="menu-btn">
            <Link to="/clockinout">
              <button className="clock-button">Stämpla In/Ut</button>
            </Link>
            <Link to="/manualinput">
              <button className="manual-button">Manuell Inmatning</button>
            </Link>
            <Link to="/overview">
              <button className="overview-button">Översikt</button>
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;