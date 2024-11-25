import React from 'react';
import { useNavigate } from 'react-router-dom';

const CancelPage = () => {
    const navigate = useNavigate();

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            padding: '20px',
        },
        title: {
            fontSize: '2rem',
            color: '#f44336',
            marginBottom: '1rem',
        },
        text: {
            fontSize: '1.2rem',
            color: '#555',
            marginBottom: '2rem',
        },
        button: {
            padding: '10px 20px',
            fontSize: '1rem',
            margin: '5px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#f44336',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#d32f2f',
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Payment Cancelled</h1>
            <p style={styles.text}>
                Your payment process has been cancelled. You can try again or return to the shop.
            </p>
            <button
                style={styles.button}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                onClick={() => navigate('/')}
            >
                Go to Home
            </button>
            <button
                style={styles.button}
                onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                onClick={() => navigate('/cart')}
            >
                Back to Cart
            </button>
        </div>
    );
};

export default CancelPage;
