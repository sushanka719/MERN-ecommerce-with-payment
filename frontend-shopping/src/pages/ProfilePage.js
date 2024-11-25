import React from "react";
import { useAuth } from "../Context/authStore"; // Adjust path as needed
import { Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import avatar from '../assets/avatar.png'

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className={styles.profileContainer}>
            <div className={styles.card}>
                <img
                    src={avatar} // Static avatar image
                    alt="User Avatar"
                    className={styles.avatar}
                />
                <h2 className={styles.name}>{user.name}</h2>
                <p className={styles.email}>Email: {user.email}</p>
                <p className={styles.status}>
                    Account Status:{" "}
                    <span className={user.isVerified ? styles.verified : styles.notVerified}>
                        {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                </p>
                <p className={styles.date}>
                    Account Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <Link to="/" className={styles.homeButton}>
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ProfilePage;
