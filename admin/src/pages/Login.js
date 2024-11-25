import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // To navigate after successful login
import { toast } from 'react-toastify';  // To show toast notifications
import 'react-toastify/dist/ReactToastify.css';  // Import toast styles
import styles from './Login.module.css';  // Import CSS module styles

// Dummy credentials for admin
const DUMMY_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const navigate = useNavigate();  // To navigate after successful login

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    // Dummy validation
    const validateLogin = () => {
        const { username, password } = credentials;

        if (username === DUMMY_CREDENTIALS.username && password === DUMMY_CREDENTIALS.password) {
            // Successful login, navigate to the admin page
            toast.success('Login successful!');
            navigate('/admin');
        } else {
            // Incorrect credentials, show an error toast
            toast.error('Invalid username or password');
        }
    };

    // Handle form submit
    const handleFormSubmit = (e) => {
        e.preventDefault();
        validateLogin();
    };

    return (
        <div className={styles.loginContainer}>
            <h1 className={styles.heading}>Admin Login</h1>
            <form onSubmit={handleFormSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={credentials.username}
                        onChange={handleInputChange}
                        placeholder="Enter your username"
                        className={styles.input}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        placeholder="Enter your password"
                        className={styles.input}
                        required
                    />
                </div>
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
};

export default Login;
