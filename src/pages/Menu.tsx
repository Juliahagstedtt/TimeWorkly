import '../styles/menu.css'
import { useNavigate } from "react-router-dom";


function Menu() {
    const navigate = useNavigate();
  return (
    <>  
    <div>
      <h1>Välommen Anders!</h1> 
¨      <div className="menu">
        <button onClick={() => navigate("/clockinout")}>Stämpla In/Ut</button>
        <button onClick={() => navigate("/manualinput")}>Registrera tid</button>
        <button onClick={() => navigate("/overview")}>Arbetad tid</button>
      </div>
    </div>  
    </>
  );
}

export default Menu;