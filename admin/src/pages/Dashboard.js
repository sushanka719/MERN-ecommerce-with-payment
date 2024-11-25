import React from "react";
import { Outlet } from "react-router-dom";  // This will be used to render nested routes
import AdminNavbar from "../components/AdminNavbar";
import SidePanel from "../components/SidePanel";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
    return (
        <div className={styles.dashboard}>
            {/* Admin Navbar */}
            <AdminNavbar />

            <div className={styles.mainContent}>
                {/* Side Panel */}
                <SidePanel />

                {/* Outlet for rendering route-specific content */}
                <div className={styles.contentArea}>
                    {/* The content on the right will change based on clicked link */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
