import React, { useState } from "react";
import { useAuth } from "../Context/authStore";
import { Link } from "react-router-dom";
import styles from "./ForgotPasswordPage.module.css";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, forgotPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Forgot Password</h2>
                </div>

                {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <p className={styles.infoText}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <div className={styles.inputGroup}>
                            <span className={styles.inputIcon}>📧</span>
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className={styles.inputField}
                            />
                        </div>
                        <button className={styles.submitButton} type="submit">
                            {isLoading ? (
                                <span className={styles.loader}></span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </button>
                    </form>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>✅</div>
                        <p>
                            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                    </div>
                )}
                <div className={styles.footer}>
                    <Link to="/login" className={styles.backLink}>
                        <span className={styles.backIcon}>←</span> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
