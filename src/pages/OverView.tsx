import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { TimeItem } from '../helpers/userStore'
import '../styles/OverView.css'


function OverView() {
  const navigate = useNavigate();
  const [totalClock, setTotalClock] = useState({ h: 0, m: 0 });
  const [totalManual, setTotalManual] = useState({ h: 0, m: 0 });
  const [weekItems, setWeekItems] = useState<TimeItem[]>([]);


  const token = localStorage.getItem("jwt") || "";

  const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
};
  
const [currentWeekStart, setCurrentWeekStart] = useState(getStartOfWeek(new Date()));


const getWeekData = (items: TimeItem[]) => {
  const start = currentWeekStart;
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23,59,59,999);

  return items.filter(item => {
    const date = new Date(item.startTime);
    return date >= start && date <= end;
  });
};

const getDayTotal = (date: Date) => {
  const dayItems = weekItems.filter(item => {
    const itemDate = new Date(item.startTime);
    return itemDate.toDateString() === date.toDateString();
  });

  return calculateTotal(dayItems);
};

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

  const days = [];

for (let i = 0; i < 5; i++) {
  const date = new Date(currentWeekStart);
  date.setDate(currentWeekStart.getDate() + i);
  days.push(date);
}

  const changeWeek = (direction: number) => {
  const newDate = new Date(currentWeekStart);
  newDate.setDate(currentWeekStart.getDate() + direction * 7);
  setCurrentWeekStart(getStartOfWeek(newDate));
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

      const filtered = getWeekData(items);
      setWeekItems(filtered);

        const clockItems = weekItems.filter(i => i.inputType === "clock-in");
        const manualItems = weekItems.filter(i => i.inputType === "manual");

        setTotalClock(calculateTotal(clockItems));
        setTotalManual(calculateTotal(manualItems));
      } catch {
        console.log("Kunde inte hämta tider");
      }
    };

    fetchTimes();
  }, [currentWeekStart]);



return (
<>
    <div className="week-container">
          <div className="week-header">
        <h2>Vecka {currentWeekStart.toLocaleDateString()}</h2>
        <button onClick={() => changeWeek(-1)}>←</button>
        <button onClick={() => changeWeek(1)}>→</button>
        <button className='month-button' onClick={() => navigate("/monthoverview")}>Månadsöversikt</button>
    </div>

        <h1>VeckoÖversikt</h1>
  <div className="week-table">
    {days.map((day, index) => {
      const total = getDayTotal(day);

      return (
        <div key={index} className="week-row">
          <span className="week-date">
            {day.toLocaleDateString()}
          </span>
          <span className="week-hours">
            {total.h}h {total.m}min
          </span>
        </div>
      );
    })}
  </div>

    <div className="week-total">
    <h3>Total vecka: {totalClock.h + totalManual.h}h {totalClock.m + totalManual.m}min</h3>
    </div>
    </div>
</>
  );
}
export default OverView;