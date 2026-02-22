import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from '../helpers/userStore';
import "../styles/Headers.css";



export default function Headers() {
  const navigate = useNavigate();

  const token = useUserStore((s) => s.token);
  const logout = useUserStore((s) => s.logout);  
  const username = useUserStore((s) => s.username); 


    function handleLogout() {
      logout();
      navigate("/loginregister");
  }
  if (!token) return null;

    return (
    <header className="head">
      <nav>
        <aside className="sidebar">
           <div>
              <p>{username}</p> 
              <Link to="/menu">
                <button className="option-buttons">Meny</button>
              </Link>

              {token && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="option-buttons"
                >
                  Logga ut
                </button>
              )}
            </div>
        </aside>
      </nav>
    </header>
  );
}