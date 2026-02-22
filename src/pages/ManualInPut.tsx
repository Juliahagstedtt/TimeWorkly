import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/ManualInPut.css";

function ManualInPut() {
  const navigate = useNavigate();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [breakCount, setBreakCount] = useState(0);
  const [breaks, setBreaks] = useState<number[]>([]);
  const [comment, setComment] = useState("");


  const handleBreakChange = (index: number, value: string) => {
    const newBreaks = [...breaks];
    newBreaks[index] = parseFloat(value) || 0;
    setBreaks(newBreaks);
  };

  const handleSubmit = async () => {
    if (!start || !end) {
    setErrorMessage("Fyll i start och slut");
    return;
    }

    setErrorMessage(""); 

    const today = new Date().toISOString().split("T")[0];

    const startISO = new Date(`${date}T${start}:00`).toISOString();
    const endISO = new Date(`${date}T${end}:00`).toISOString();

    const totalBreakMinutes = breaks.reduce((acc, b) => acc + b, 0);

    const token = localStorage.getItem("jwt");

    await fetch("http://localhost:10000/time/manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startTime: startISO,
        endTime: endISO,
        breaks: totalBreakMinutes,
        comment,
      }),
    });

    navigate("/menu");
  };

return (
<>
    <div className="manual-container">
        <input 
        type="date" 
        value={date} 
        onChange={e => setDate(e.target.value)}/>


        <p>Start:</p>
        <input 
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}/>

        <p>Slut:</p>
        <input 
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}/>

        <p>Rast</p>
        <input         
        type="number"
        min={0}
        value={breakCount}
        onChange={e => {
          const count = parseInt(e.target.value) || 0;
          setBreakCount(count);
          setBreaks(Array(count).fill(0));
        }}
      />

      {breaks.map((b, index) => (
        <div key={index}>
          <p>Rast {index + 1} (minuter):</p>
          <input
            type="number"
            min={0}
            value={b}
            onChange={e => handleBreakChange(index, e.target.value)}
          />
        </div>
      ))}

        <p>Kommentar:</p>
        <textarea value={comment} onChange={e => setComment(e.target.value)} />
        
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button className='reg-buttons' onClick={handleSubmit}>Registrera</button>

    </div>
</>
  );
}
export default ManualInPut;