import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/ManualInPut.css";

function ManualInPut() {
  const navigate = useNavigate();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [breakCount, setBreakCount] = useState<number | "">("");
  const [breaks, setBreaks] = useState<(number | "")[]>([]);


const handleBreakChange = (index: number, value: string) => {
  const newBreaks = [...breaks];

  if (value === "") {
    newBreaks[index] = "";
  } else {
    newBreaks[index] = Number(value);
  }

  setBreaks(newBreaks);
};

  const handleSubmit = async () => {
      if (!date || !start || !end) {
    setErrorMessage("Fyll i datum, start och slut");
    return;
  }

    setErrorMessage(""); 

  const startISO = `${date}T${start}:00.000Z`;
  const endISO = `${date}T${end}:00.000Z`;

  const totalBreakMinutes = breaks
    .filter((b): b is number => b !== "")
    .reduce((a, b) => a + b, 0);

    const token = localStorage.getItem("jwt");

    await fetch("/time/manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        startTime: startISO,
        endTime: endISO,
        breakMinutes: totalBreakMinutes,
      }),
    });

    navigate("/menu");
  };

return (
<>
    <div className="card">
        <h2>Registrera arbets tid</h2>
        <p>Datum</p>
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

        <p>Antal raster</p>
        <select
          value={breakCount}
          onChange={e => {
            const count = parseInt(e.target.value);
            setBreakCount(count);
            setBreaks(Array(count).fill(""));
          }}>
          <option value=""></option>
          <option value={1}>1 rast</option>
          <option value={2}>2 raster</option>
          <option value={3}>3 raster</option>
          <option value={4}>4 raster</option>
          <option value={5}>5 raster</option>
        </select>


      {breaks.map((b, index) => (
        <div key={index}>
          <p>Rast {index + 1} (minuter):</p>
          <input
            type="number"
            min={0}
            placeholder="t.ex. 30"
            value={b}
            onChange={e => handleBreakChange(index, e.target.value)}
          />
        </div>
      ))}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className='reg-buttons' onClick={handleSubmit}>Registrera</button>

    </div>
</>
  );
}
export default ManualInPut;