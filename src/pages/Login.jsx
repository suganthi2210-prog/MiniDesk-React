import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { persistAuth, startOAuthLogin } from "../services/auth";

function Login() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [isBusy, setIsBusy] = useState(false);
    const navigate = useNavigate();

    // This is the fallback login path for an existing backend that still supports username/password.
    const handleLogin = async () => {
        setIsBusy(true);

        try {
            const response = await api.post("Auth/login", {
                username,
                password
            });

            persistAuth(response.data.token, { name: username });
            navigate("/tickets");
        }
        catch (error) {
            alert("Invalid username/password");
        }
        finally {
            setIsBusy(false);
        }
    };

    // This starts the OAuth authorization-code flow with PKCE.
    const handleOAuthLogin = async () => {
        setIsBusy(true);

        try {
            await startOAuthLogin();
        }
        catch (error) {
            alert(error.message || "Unable to start OAuth login.");
        }
        finally {
            setIsBusy(false);
        }
    };

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h2 className="text-center fw-bold">
                    <i className="bi bi-ticket-perforated-fill text-primary fs-2 me-2"></i>
                    MiniDesk
                </h2>
                <p className="text-center text-secondary small mb-4">Ticket Management Portal</p>

                <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="mb-4">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button className="btn btn-primary w-100 py-2 mb-2" onClick={handleLogin} disabled={isBusy}>
                    {isBusy ? "Signing in..." : "Login"}
                </button>

                <button className="btn btn-outline-primary w-100 py-2" onClick={handleOAuthLogin} disabled={isBusy}>
                    Continue with OAuth
                </button>
            </div>
        </div>
    );
}

export default Login;