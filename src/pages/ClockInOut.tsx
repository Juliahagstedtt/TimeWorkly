import '../styles/ClockInOut.css'
import { useState, useEffect } from 'react';


function ClockInOut() {
  const [In, setIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const token = localStorage.getItem("jwt")


  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const res = await fetch("/time", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (res.ok) {
          const activeTime = data.data.find((t: { endTime: string | null; startTime: string }) => !t.endTime)
          if (activeTime) {
            setIn(true)
            setClockInTime(new Date(activeTime.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          } else {
            setIn(false)
            setClockInTime(null)
          }
        }
      } catch {
        console.log("Kunde inte hämta tid")
      }
    }

    fetchTimeData()
}, [token])


const handleClockIn = async () => {
  setErrorMessage(null);
  try {
    const res = await fetch("/time/clock-in", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      }
    });

    const data = await res.json();

    if (!res.ok) { 
      setErrorMessage(data.error); 
      return; 
    }

    setIn(true);
    setClockInTime(new Date(data.data.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setClockOutTime(null);

  } catch {
    setErrorMessage("Något gick fel.");
  }
};

  const handleClockOut = async () => {
  setErrorMessage(null);
  try {
    const res = await fetch(`/time/clock-out`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      setErrorMessage(data.error);
      return;
    }

    
   
    setClockOutTime(new Date(data.data.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setIn(false);
    setClockInTime(null);

  } catch (error) {
    setErrorMessage("Något gick fel.");
  }
  };

  return ( 
    <div className="card">
      <h3>Stämpla In/Ut</h3>

      <div className="clock-buttons">
        {!In ? (
          <button className="stamp-button" onClick={handleClockIn}>Stämpla In</button>
        ) : (
          <button className="stamp-button" onClick={handleClockOut}>Stämpla Ut</button>
        )}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {clockInTime && !clockOutTime && <p>Du har stämplat in: {clockInTime}</p>}
      {clockOutTime && <p>Du har stämplat ut: {clockOutTime}</p>}

    </div>
  );
}

export default ClockInOut;