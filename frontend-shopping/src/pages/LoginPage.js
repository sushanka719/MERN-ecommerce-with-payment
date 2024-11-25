import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/authStore";
import styles from "./LoginPage.module.css";
const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.header}>Welcome Back</h2>

                <form onSubmit={handleLogin} className={styles.formContainer}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.forgotPasswordContainer}>
                        <Link to="/forgot-password" className={styles.forgotPasswordLink}>
                            Forgot password?
                        </Link>
                    </div>

                    {error && <p className={styles.errorText}>{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`${styles.button} ${isLoading ? styles.disabled : ""}`}
                    >
                        {isLoading ? "Loading..." : "Login"}
                    </button>
                </form>
                <div className={styles.signupContainer}>
                    <p className={styles.signupText}>
                        Don't have an account?{" "}
                        <Link to="/signup" className={styles.signupLink}>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
