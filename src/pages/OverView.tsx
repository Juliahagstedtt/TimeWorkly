import { useNavigate } from "react-router-dom";

function OverView() {
    const navigate = useNavigate();

return (
<>
    <div>
        <button className='reg-buttons' onClick={() => navigate("/monthoverview")}>Månadsöversikt</button>
        <h1>VeckoÖversikt</h1>

    </div>
</>
  );
}
export default OverView;