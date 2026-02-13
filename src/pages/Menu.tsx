import '../styles/menu.css'
import { useNavigate } from "react-router-dom";


function Menu() {
    const navigate = useNavigate();
  return (
    <>     
¨    <div className="menu">
        <button onClick={() => navigate("/clockinout")}>Stämpla In/Ut</button>
        <button>Registrera tid</button>
        <button>Arbetad tid</button>
    </div>

    </>
  );
}

export default Menu;