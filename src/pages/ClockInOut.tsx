import '../styles/ClockInOut.css'
import { useState, useEffect } from 'react';


function ClockInOut() {
  const [In, setIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const token = localStorage.getItem("jwt")


  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        const res = await fetch("http://localhost:10000/time", {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await res.json()

        if (res.ok) {
          const activeTime = data.data.find((t: { endTime: string | null; startTime: string }) => !t.endTime)
          if (activeTime) {
            setIn(true)
            setClockInTime(new Date(activeTime.startTime).toLocaleTimeString())
          } else {
            setIn(false)
            setClockInTime(null)
          }
          setTotalMinutes(data.totalMinutes)
        }
      } catch {
        console.log("Kunde inte hämta tid")
      }
    }

    fetchTimeData()
  }, [])


const handleClockIn = async () => {
  setErrorMessage(null);
  try {
    const res = await fetch("http://localhost:10000/time/clock-in", {
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
    setClockInTime(new Date(data.data.startTime).toLocaleTimeString());
    setClockOutTime(null);

  } catch {
    setErrorMessage("Något gick fel.");
  }
};

  const handleClockOut = async () => {
  setErrorMessage(null);
  try {
    const res = await fetch(`http://localhost:10000/time/clock-out`, {
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

    
   
    setClockOutTime(new Date(data.data.endTime).toLocaleTimeString())
    setIn(false);
    setClockInTime(null);

  } catch (error) {
    setErrorMessage("Något gick fel.");
  }
  };

  return ( 
    <div className="clock-container">
      <h3>Stämpla In/Ut</h3>
      <div className="clock-buttons">
        {!In ? (
          <button className="In" onClick={handleClockIn}>Stämpla In</button>
        ) : (
          <button className="Out" onClick={handleClockOut}>Stämpla Ut</button>
        )}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {clockInTime && !clockOutTime && <p>Du har stämplat in: {clockInTime}</p>}
      {clockOutTime && <p>Du har stämplat ut: {clockOutTime}</p>}

    </div>
  );
}

export default ClockInOut;