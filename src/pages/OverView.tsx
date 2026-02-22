import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { TimeItem } from '../helpers/userStore'

function OverView() {
    const navigate = useNavigate();
  const [totalClock, setTotalClock] = useState({ h: 0, m: 0 });
  const [totalManual, setTotalManual] = useState({ h: 0, m: 0 });

  const token = localStorage.getItem("jwt") || "";

  const calculateTotal = (items: TimeItem[]) => {
    let totalMinutes = 0;
    for (const item of items) {
      if (item.endTime) {
        const start = new Date(item.startTime).getTime();
        const end = new Date(item.endTime).getTime();
        totalMinutes += (end - start) / 60000;
      }
    }
    return { h: Math.floor(totalMinutes / 60), m: Math.floor(totalMinutes % 60) };
  };

  useEffect(() => {
    const fetchTimes = async () => {
      try {
        const res = await fetch("http://localhost:10000/time", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        const items: TimeItem[] = data.data;

        const clockItems = items.filter((i) => i.inputType === "clock-in");
        const manualItems = items.filter((i) => i.inputType === "manual");

        setTotalClock(calculateTotal(clockItems));
        setTotalManual(calculateTotal(manualItems));
      } catch {
        console.log("Kunde inte hämta tider");
      }
    };

    fetchTimes();
  }, []);


return (
<>
    <div>
        <button className='reg-buttons' onClick={() => navigate("/monthoverview")}>Månadsöversikt</button>
        <h1>VeckoÖversikt</h1>
      <p>Total arbetstid Stämpla In/Ut: {totalClock.h}h {totalClock.m}min</p>
      <p>Total arbetstid Manuelt: {totalManual.h}h {totalManual.m}min</p>
    </div>
</>
  );
}
export default OverView;