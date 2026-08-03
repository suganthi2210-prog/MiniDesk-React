import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { finishOAuthLogin } from "../services/auth";

function OAuthCallback() {
    const [message, setMessage] = useState("Finishing sign-in...");
    const navigate = useNavigate();

    useEffect(() => {
        const completeLogin = async () => {
            try {
                await finishOAuthLogin(window.location.href);
                setMessage("Login complete. Redirecting...");
                navigate("/tickets");
            }
            catch (error) {
                setMessage(error.message || "OAuth login failed.");
            }
        };

        completeLogin();
    }, [navigate]);

    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4 text-center" style={{ width: "360px" }}>
                <h4 className="mb-3">Signing you in</h4>
                <p className="text-secondary">{message}</p>
            </div>
        </div>
    );
}

export default OAuthCallback;
