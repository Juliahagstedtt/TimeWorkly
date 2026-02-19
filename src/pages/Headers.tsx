import { Link, useNavigate } from "react-router-dom";
import "../styles/Headers.css";



export default function Headers() {
  const navigate = useNavigate();

  return (
    <header className="head">
        <nav>
            <>
            <div>
                <Link to="/menu">
                <button className="reg-buttons">Meny</button>
                </Link>
                <button className="reg-buttons" onClick={() => navigate("/")}>Logga ut</button>
            </div>
            </>
        </nav>
    </header>
  );
}