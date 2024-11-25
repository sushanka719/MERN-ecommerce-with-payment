import React, { useState } from "react";
import styles from "./SignUpPage.module.css";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authStore";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const { signup, error, isLoading } = useAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();

        try {
            console.log(email, password, name)
            await signup(email, password, name);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupFormContainer}>
                <h2 className={styles.heading}>Create Account</h2>
                {error && <div className={styles.errorMessage}>{error}</div>}

                <form onSubmit={handleSignUp} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name" className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Password strength meter */}
                    <PasswordStrengthMeter password={password} />

                    <button type="submit" className={styles.signupButton} disabled={isLoading}>
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Already have an account?{" "}
                        <Link to="/login" className={styles.loginLink}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
