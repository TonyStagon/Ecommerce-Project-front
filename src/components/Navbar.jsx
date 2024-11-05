import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Thurto.jpg';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ isLoggedIn, onLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown((prev) => !prev);
    };

    return (
        <div>
            <div className="top-bar">
                FREE SHIPPING over R2000 | 1 YEAR GUARANTEE |
            </div>
            <nav className="navbar">
                <Link to="/">
                    <img src={logo} alt="Thurto Logo" className="logo" />
                </Link>
                <div className="icon-links">
                    {isLoggedIn && (
                        <Link to="/dashboard" className="create-store-link">
                            Create Store
                        </Link>
                    )}
                    <div
                        className="user-icon-wrapper"
                        onClick={toggleDropdown}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <FontAwesomeIcon icon={faUser} className="icon" />
                        {isLoggedIn && <span className="login-indicator"></span>}
                        {showDropdown && (
                            <div className="dropdown-menu">
                                {isLoggedIn ? (
                                    <>
                                        <Link to="/update-login" className="dropdown-item">Update Login</Link>
                                        <div onClick={onLogout} className="dropdown-item">
                                            Logout
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="dropdown-item">Login</Link>
                                        <Link to="/register" className="dropdown-item">Register</Link>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <Link to="/cart">
                        <FontAwesomeIcon icon={faShoppingCart} className="icon" />
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
