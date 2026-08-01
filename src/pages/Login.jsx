import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
const [username, setUsername] = useState("admin");
const [password, setPassword] = useState("admin123");
const navigate = useNavigate();

const handleLogin = async ()=>{
    try{
        const response = await api.post("Auth/login", {
            username,
            password
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", username);

        navigate("/tickets");
    }
    catch(error){
        alert("Invalid username/password");
    }
};
return(
    <div className="container vh-100 d-flex justify-content-center align-items-center">
        <div className="card shadow p-4" style={{ width: "400px"}}>
            <h2 className="text-center fw-bold">
                <i className="bi bi-ticket-perforated-fill text-primary fs-2 me-2"></i>
                MiniDesk
            </h2>
            <p className="text-center text-secondary small mb-4">Ticket Management Portal</p>
            <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)}/>
            </div>
            <div className="mb-4">
                <label className="form-label">Password</label>
                <input type="text" className="form-control" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </div>
            <button className="btn btn-primary w-100 py-2" onClick={handleLogin}>Login</button>
        </div>
    </div>
);
}

export default Login;