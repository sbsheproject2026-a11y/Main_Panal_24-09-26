 import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ setSidebarOpen, sidebarOpen }) {
    const navigate = useNavigate();
    const name = localStorage.getItem("name") || "User";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        localStorage.removeItem("RoleId");
        localStorage.removeItem("UserId");
        localStorage.removeItem("Username");
        localStorage.removeItem("user");
        localStorage.removeItem("userData");

        sessionStorage.clear();

        navigate("/", { replace: true });
    };

    return (
        <header
            id="header"
            className="header fixed-top d-flex align-items-center"
        >
            <div className="d-flex align-items-center justify-content-between">
                <Link to="#" className="logo d-flex align-items-center">
                    <img
                        src="/assets/img/websheddlogo.png"
                        alt="Logo"
                    />
                </Link>

                <i
                    className="bi bi-list toggle-sidebar-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    style={{ cursor: "pointer" }}
                ></i>
            </div>

            
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item d-block d-lg-none">
                        <a
                            className="nav-link nav-icon search-bar-toggle"
                            href="#"
                            onClick={(e) => e.preventDefault()}
                        >
                            <i className="bi bi-search"></i>
                        </a>
                    </li>

                    <li className="nav-item dropdown pe-3">
                        <a
                            className="nav-link nav-profile d-flex align-items-center pe-0"
                            href="#"
                            data-bs-toggle="dropdown"
                        >
                            <i className="bi bi-person-circle"></i>

                            <span className="d-none d-md-block dropdown-toggle ps-2">
                                {name}
                            </span>
                        </a>

                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{name}</h6>
                                <span>SBSHE User</span>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center"
                                    to="/profile"
                                >
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>
 

                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center"
                                    to="/help"
                                >
                                    <i className="bi bi-question-circle"></i>
                                    <span>Need Help?</span>
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <Link
                                    className="dropdown-item d-flex align-items-center"
                                    to="/"
                                    onClick={handleLogout}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    <span>Sign Out</span>
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;
