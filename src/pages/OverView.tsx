import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { TimeItem } from '../helpers/userStore'
import '../styles/OverView.css'
import EditIcon from "../assets/EditIcon.png";

function OverView() {
  const navigate = useNavigate();
  const [totalClock, setTotalClock] = useState({ h: 0, m: 0 });
  const [totalManual, setTotalManual] = useState({ h: 0, m: 0 });
  const [weekItems, setWeekItems] = useState<TimeItem[]>([]);

  const token = localStorage.getItem("jwt") || "";
  const toISODate = (d: Date) => d.toLocaleDateString("sv-SE");

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
  const start = new Date(currentWeekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return items.filter(item => {
    const date = new Date(item.startTime);
    return date >= start && date <= end;
  });
};

const getDayTotal = (isoDay: string) => {
  const dayItems = weekItems.filter(item => item.startTime.slice(0, 10) === isoDay);
  return calculateTotal(dayItems);
};

const totalWeekMinutes =
  (totalClock.h * 60 + totalClock.m) +
  (totalManual.h * 60 + totalManual.m);

const totalWeek = {
  h: Math.floor(totalWeekMinutes / 60),
  m: totalWeekMinutes % 60
};

const calculateTotal = (items: TimeItem[]) => {
  let totalMinutes = 0;
  for (const item of items) {
    if (item.endTime) {
      const start = new Date(item.startTime).getTime();
      const end = new Date(item.endTime).getTime();
      let diffMinutes = (end - start) / 60000;

      if (item.breakMinutes) {
        diffMinutes -= item.breakMinutes;
      }

      totalMinutes += diffMinutes;
    }
  }
  return { h: Math.floor(totalMinutes / 60), m: Math.floor(totalMinutes % 60) };
};

  const days = [];

for (let i = 0; i < 7; i++) {
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
        const res = await fetch("/time", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        const items: TimeItem[] = data.data;
        console.log("ALLA ITEMS:", items);

      const filtered = getWeekData(items);
      setWeekItems(filtered);

      
        const clockItems = filtered.filter(i => i.inputType === "clock-in");
        const manualItems = filtered.filter(i => i.inputType === "manual");

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
    <div className="card">
          <div className="week-header">
        <button onClick={() => changeWeek(-1)}> ⟵ </button>
        <button onClick={() => changeWeek(1)}> ⟶ </button>
    </div>

        <h1>Veckoöversikt</h1>
 <div className="week-table">

    <div className="head-names">
    <span className="table-heads">Datum</span>
    <span className="table-heads">Arbetade timmar</span>
    <span className="table-heads">Redigera</span>
  </div>

{days.map((day, index) => {
  const dayISO = toISODate(day);
  const total = getDayTotal(dayISO);
  const hasItems = weekItems.some(item => item.startTime.slice(0, 10) === dayISO);

  return (
    <div key={index} className="week-row">
      <span className="week-date">{day.toLocaleDateString("sv-SE")}</span>

      <span className="week-hours">
        {total.h}h {total.m}min
      </span>

  {hasItems ? (
    <button onClick={() => navigate(`/edit/${dayISO}`)}>
      <img className="edit-button" src={EditIcon} alt="Redigera" />
    </button>
  ) : (
    <span></span>
  )}
    </div>
  );
})}
  </div>
  </div>
    <div className="week-total">
    <h3>  Total vecka: {totalWeek.h}h {totalWeek.m}min</h3>
  </div>
</>
  );
}
export default OverView;