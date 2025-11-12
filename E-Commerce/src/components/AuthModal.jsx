// src/components/AuthModal.jsx
import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { login, register } from "../services/authService";

export default function AuthModal({ show, onClose, onAuthSuccess }) {
    const [activeTab, setActiveTab] = useState("login"); // 'login' | 'register'
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null); // { type: 'danger'|'success', msg: string }

    // Login state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register state
    const [fullName, setFullName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [mobileNo, setMobileNo] = useState("");

    useEffect(() => {
        if (!show) {
            // reset on hide
            setAlert(null);
            setLoginEmail(""); setLoginPassword("");
            setFullName(""); setRegEmail(""); setRegPassword(""); setMobileNo("");
            setActiveTab("login");
            setLoading(false);
        }
    }, [show]);

    const emailOk = useMemo(() => /^\S+@\S+\.\S+$/.test(regEmail), [regEmail]);
    const passOk = useMemo(() => regPassword.length >= 8, [regPassword]);
    const mobileOk = useMemo(() => /^\d{10}$/.test(mobileNo), [mobileNo]);
    const nameOk = useMemo(() => fullName.trim().length >= 3, [fullName]);
    const registerValid = nameOk && emailOk && passOk && mobileOk;

    async function handleLogin(e) {
        e.preventDefault();
        setAlert(null);
        setLoading(true);
        try {
            const data = await login({ email: loginEmail.trim(), password: loginPassword });
            // Success -> store and notify parent
            localStorage.setItem("user", JSON.stringify(data));
            setAlert({ type: "success", msg: "Logged in successfully." });
            onAuthSuccess?.(data); // parent will redirect based on role
            onClose?.();
        } catch (err) {
            // 401 or 500 -> show bootstrap alert
            const status = err?.response?.status;
            if (status === 401) {
                setAlert({ type: "danger", msg: "Invalid email or password." });
            } else if (status === 500) {
                setAlert({ type: "danger", msg: "Server error. Please try again." });
            } else {
                setAlert({ type: "danger", msg: "Something went wrong." });
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        setAlert(null);
        setLoading(true);
        try {
            const { status } = await register({
                fullName: fullName.trim(),
                email: regEmail.trim(),
                password: regPassword,
                mobileNo: mobileNo.trim(),
                role: "USER"
            });
            if (status === 201) {
                setAlert({ type: "success", msg: "Registered successfully. You can log in now." });
                setActiveTab("login");
            } else {
                setAlert({ type: "danger", msg: "Unexpected response." });
            }
        } catch (err) {
            const status = err?.response?.status;
            if (status === 409) {
                setAlert({ type: "danger", msg: "User already exists." });
            } else if (status === 400) {
                setAlert({ type: "danger", msg: "Email required / invalid input." });
            } else {
                setAlert({ type: "danger", msg: "Server error. Please try again." });
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className={`modal fade ${show ? "show d-block" : ""}`}
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={show ? { display: "block", backgroundColor: "rgba(0,0,0,0.5)" } : {}}
        >
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <ul className="nav nav-tabs card-header-tabs">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                                    onClick={() => setActiveTab("login")}
                                >
                                    Login
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                                    onClick={() => setActiveTab("register")}
                                >
                                    Register
                                </button>
                            </li>
                        </ul>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>

                    <div className="modal-body">
                        {alert && (
                            <div className={`alert alert-${alert.type}`} role="alert">
                                {alert.msg}
                            </div>
                        )}

                        {activeTab === "login" ? (
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={loginEmail}
                                        onChange={(e) => setLoginEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${fullName && !nameOk ? "is-invalid" : ""}`}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">Name should be at least 3 characters.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control ${regEmail && !emailOk ? "is-invalid" : ""}`}
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">Please enter a valid email.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className={`form-control ${regPassword && !passOk ? "is-invalid" : ""}`}
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">Password must be at least 8 characters.</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Mobile No</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${mobileNo && !mobileOk ? "is-invalid" : ""}`}
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}
                                        required
                                    />
                                    <div className="invalid-feedback">Enter 10 digit mobile number.</div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading || !registerValid}
                                >
                                    {loading ? "Registering..." : "Register"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}

AuthModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAuthSuccess: PropTypes.func, // receives user object
};
