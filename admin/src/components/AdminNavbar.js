// AdminNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminNavbar.module.css"; 
import { useNavigate } from 'react-router-dom'; 


const AdminNavbar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/')
    };

    return (
        <nav className={styles.adminNavbar}>
            <div className={styles.logo}>
                <Link to="/">
                    <h1>SakiraVision</h1>
                </Link>
            </div>
            <ul className={styles.navLinks}>
                <li>
                    <Link to="/admin/profile">Profile</Link>
                </li>
                {/* <li>
                    <Link to="/admin/signin">Sign In</Link>
                </li> */}
                <li>
                    <button className={styles.logoutButton} onClick={handleLogout}>
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
