import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { TimeItem } from "../helpers/userStore";
import { useUserStore } from "../helpers/userStore";
import "../styles/Edit.css";

function Edit() {
  const navigate = useNavigate();
  const { date } = useParams();
  const location = useLocation();
  const token = useUserStore((s) => s.token);

  const selectedIdFromState = location.state?.selectedId ?? null;

  const [times, setTimes] = useState<TimeItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(selectedIdFromState);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!date) return;

    const fetchTimes = async () => {
      const res = await fetch("http://localhost:10000/time", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const filtered: TimeItem[] = data.data.filter((t: TimeItem) =>
        t.startTime.slice(0, 10) === date
      );
      setTimes(filtered);

      if (selectedIdFromState) {
        const selected = filtered.find((t) => t.id === selectedIdFromState);
        if (selected) {
          setStart(selected.startTime.slice(11, 16));
          setEnd(selected.endTime ? selected.endTime.slice(11, 16) : "");
        }
      }
    };

    fetchTimes();
  }, [date, token, selectedIdFromState]);

  const handleSelect = (item: TimeItem) => {
    setSelectedId(item.id);
    setStart(item.startTime.slice(11, 16));
    setEnd(item.endTime ? item.endTime.slice(11, 16) : "");
  };

const handleSave = async () => {
setErrorMessage("");
  if (!selectedId || !date) return;


  if (!start || !end) {
    setErrorMessage("Start och slut måste fyllas i.");
    return;
  }

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  const diff = endMinutes - startMinutes;

  if (diff <= 0) {
    setErrorMessage("Sluttiden måste vara efter starttiden.");
    return;
  }

  if (diff < 1) {
    setErrorMessage("Arbetspasset måste vara minst 1 minut.");
    return;
  }

const startISO = `${date}T${start}:00.000Z`;
const endISO = `${date}T${end}:00.000Z`;

const res = await fetch(`http://localhost:10000/time/${selectedId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ startTime: startISO, endTime: endISO }),
});

if (!res.ok) {
  const data = await res.json().catch(() => null);
  setErrorMessage(data?.error ?? "Kunde inte spara ändringen.");
  return;
}

navigate("/overview");

  navigate("/overview");
};

  return (
    <div className="manual-container">
      <h2>Redigera arbetspass {date}</h2>

      {times.length === 0 && <p>Inga tider denna dag.</p>}

      {times.length > 0 && (
        <div className="time-list">
          {times.map((t) => (
            <button
              key={t.id}
              className={t.id === selectedId ? "selected-time" : ""}
              onClick={() => handleSelect(t)}
            >
              {t.startTime.slice(11, 16)} - {t.endTime ? t.endTime.slice(11, 16) : "Aktiv"}
            </button>
          ))}
        </div>
      )}

      {selectedId && (
        <div className="edit-form">
          <label>Start:</label>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />

          <label>Slut:</label>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />

          <button className="reg-buttons" onClick={handleSave}>Spara</button>
        </div>
      )}

      <button className="reg-buttons" onClick={() => navigate("/overview")}>Tillbaka</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default Edit;