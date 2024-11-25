import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./ResetPasswordPage.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../Context/authStore";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { token } = useParams();
    const navigate = useNavigate();
    const {resetPassword} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password reset successfully, redirecting to login page...");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Reset Password</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <label className={styles.label}>
                        New Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </label>
                    <label className={styles.label}>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className={styles.button}
                        disabled={!password || !confirmPassword}
                    >
                        Set New Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
