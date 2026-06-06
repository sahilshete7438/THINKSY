import React, { useState } from "react";
import "./Auth.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function Auth({ onAuthSuccess }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        const endpoint = isLogin ? "login" : "register";

        try {
            const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            // Call parent success handler
            onAuthSuccess(data.token, data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authContainer">
            <div className="authCard">
                <div className="authHeader">
                    <img src="src/assets/blacklogo.png" alt="Thinksy Logo" className="authLogo" />
                    <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>
                    <p className="authSubtext">to continue to Thinksy</p>
                </div>

                <form onSubmit={handleSubmit} className="authForm">
                    {error && <div className="authError">{error}</div>}

                    <div className="inputGroup">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="inputGroup">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button type="submit" className="authButton" disabled={loading}>
                        {loading ? "Please wait..." : isLogin ? "Continue" : "Sign Up"}
                    </button>
                </form>

                <div className="authFooter">
                    <span>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </span>
                    <button
                        type="button"
                        className="toggleButton"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setUsername("");
                            setPassword("");
                        }}
                        disabled={loading}
                    >
                        {isLogin ? "Sign up" : "Log in"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
