// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

export default function Navbar({ user, onLoginClick, onLogout }) {
    const role = user?.role;

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">MyShop</Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    {/* Left side - can add categories, search, etc. */}
                    <ul className="navbar-nav me-auto">

                        {role === "ADMIN" && (
                            <div className="d-flex">
                                <NavLink to="/admin" className="nav-link me-4">Admin Dashboard</NavLink>

                                <NavLink
                                    to="/admin/orders"
                                    className="btn btn-outline-primary"
                                >
                                    View All Orders
                                </NavLink>


                            </div>
                        )}
                    </ul>

                    {/* Right side based on auth */}
                    <ul className="navbar-nav ms-auto">
                        {!user && (
                            <li className="nav-item">
                                <button className="btn btn-primary" onClick={onLoginClick}>Login</button>
                            </li>
                        )}

                        {user && user.role === "USER" && (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">Hi, {user.fullName}</span>
                                </li>

                                <li className="nav-item">
                                    <NavLink to="/orders" className="nav-link">My Orders</NavLink>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-secondary ms-2" onClick={onLogout}>Logout</button>
                                </li>
                            </>
                        )}

                        {user && user.role === "ADMIN" && (
                            <>
                                <li className="nav-item">
                                    <span className="navbar-text me-3">Admin</span>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-outline-secondary" onClick={onLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

Navbar.propTypes = {
    user: PropTypes.object,
    onLoginClick: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};
