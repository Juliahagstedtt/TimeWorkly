import '../styles/ClockInOut.css'
// import { useNavigate } from "react-router-dom";


function ClockInOut() {
    // const navigate = useNavigate();
  return (
    <>     
¨    <div className="clock-container">
        <h3>Stämpla In/Ut</h3>
        {/* <button className='clock-buttons' onClick={() => navigate("/menu")}>Meny</button> */}

        <div>
          <button className='In'>Stämpla In</button>
        </div>
    </div>

    </>
  );
}

export default ClockInOut;