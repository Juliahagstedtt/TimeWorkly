import { useNavigate } from "react-router-dom";
import "../styles/ManualInPut.css";

function ManualInPut() {
    const navigate = useNavigate();

return (
<>
    <div className="manual-container">
        <p>Start:</p>
        <input 
        placeholder="08:00"/>

        <p>Slut:</p>
        <input 
        placeholder="17:00"/>

        <p>Rast</p>
        <input placeholder="Rast"/> 
        <select name="Rast"/>

        <p>Kommentar</p>
        <textarea placeholder="Valfritt" />

        <button className='reg-buttons' onClick={() => navigate("/menu")}>Registrera</button>

    </div>
</>
  );
}
export default ManualInPut;