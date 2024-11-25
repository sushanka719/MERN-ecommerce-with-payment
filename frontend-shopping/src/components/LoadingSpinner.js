import React from 'react';

const LoadingSpinner = () => {
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.2)',  // Dark black background with more opacity
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,  // Ensures spinner is on top of content
        pointerEvents: 'none',  // Allows clicks to pass through the spinner
        backdropFilter: 'blur(1px)',  // Slight blur effect on background content
    };

    return (
        <>
            <style>
                {`
          .spinner {
            border: 8px solid #f3f3f3; /* Light grey background */
            border-top: 8px solid #3498db; /* Bright blue color for the spinning part */
            border-radius: 50%;
            width: 80px;
            height: 80px;
            animation: spin 1.5s linear infinite; /* Faster rotation for smoother effect */
          }

          /* Keyframes for spinning animation */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
            </style>
            <div style={overlayStyle}>
                <div className="spinner"></div>
            </div>
        </>
    );
};

export default LoadingSpinner;
