import '../styles/ClockInOut.css'
// import { Temporal } from '@js-temporal/polyfill';
// import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';


function ClockInOut() {
    // const now = Temporal.Now.plainDateTimeISO();
  const [stampedIn, setStampedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);

  useEffect(() => {
    const savedIn = localStorage.getItem('clockInTime');
    const savedOut = localStorage.getItem('clockOutTime');
    if (savedIn) {
      setClockInTime(savedIn);
      setStampedIn(true); 
    }
    if (savedOut) {
      setClockOutTime(savedOut);
      setStampedIn(false);
    }
  }, []);

  const handleClockIn = () => {
    const now = new Date().toLocaleTimeString();
    setClockInTime(now);
    localStorage.setItem('clockInTime', now);
    setStampedIn(true);
    setClockOutTime(null); 
    localStorage.removeItem('clockOutTime');
  };

  const handleClockOut = () => {
    const now = new Date().toLocaleTimeString();
    setClockOutTime(now);
    localStorage.setItem('clockOutTime', now);
    setStampedIn(false);
  };

  return (
    <>     
    <div className="clock-container">
      <h3>Stämpla In/Ut</h3>
      <div className="clock-buttons">
        {!stampedIn ? (
          <button className="In" onClick={handleClockIn}>
            Stämpla In
          </button>
        ) : (
          <button className="Out" onClick={handleClockOut}>
            Stämpla Ut
          </button>
        )}
      </div>

      {clockInTime && !clockOutTime && (
        <p>Du har stämplat in: {clockInTime}</p>
      )}

      {clockOutTime && (
        <p>Du har stämplat ut: {clockOutTime}</p>
      )}

    </div>
    </>
  );
}

export default ClockInOut;