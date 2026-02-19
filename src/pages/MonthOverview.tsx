import { useNavigate } from "react-router-dom";

function MonthOverView() {
    const navigate = useNavigate();

return (
<>
    <div>
        <button className='reg-buttons' onClick={() => navigate("/overview")}>VeckoÖversikt</button>
        <h1>MånadÖversikt</h1>

    </div>
</>
  );
}
export default MonthOverView;