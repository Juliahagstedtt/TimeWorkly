import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '../helpers/userStore';
import "../styles/Headers.css";



export default function Headers() {
  const navigate = useNavigate();

  const token = useUserStore((s) => s.token);
  const logout = useUserStore((s) => s.logout);  

    function handleLogout() {
      logout();
      navigate("/loginregister");
  }
  if (!token) return null;

    return (
    <header className="head">
      <nav>
        <div>
          <Link to="/menu">
            <button className="reg-buttons">Meny</button>
          </Link>

          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="reg-buttons"
            >
              Logga ut
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}