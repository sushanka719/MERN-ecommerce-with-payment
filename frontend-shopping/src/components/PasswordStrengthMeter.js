import React, { useState, useEffect } from "react";

const PasswordStrengthMeter = ({ password }) => {
    const [strength, setStrength] = useState(0);

    useEffect(() => {
        if (password.length === 0) {
            setStrength(0);
        } else {
            setStrength(calculateStrength(password));
        }
    }, [password]);

    const calculateStrength = (password) => {
        let strengthScore = 0;

        // Length check
        if (password.length >= 8) strengthScore += 1;

        // Uppercase letter check
        if (/[A-Z]/.test(password)) strengthScore += 1;

        // Lowercase letter check
        if (/[a-z]/.test(password)) strengthScore += 1;

        // Number check
        if (/[0-9]/.test(password)) strengthScore += 1;

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) strengthScore += 1;

        return strengthScore;
    };

    const getStrengthText = (score) => {
        switch (score) {
            case 0:
            case 1:
                return "Weak";
            case 2:
                return "Moderate";
            case 3:
                return "Strong";
            case 4:
            case 5:
                return "Very Strong";
            default:
                return "Weak";
        }
    };

    const getStrengthColor = (score) => {
        switch (score) {
            case 0:
            case 1:
                return "bg-red-500"; // Weak
            case 2:
                return "bg-yellow-500"; // Moderate
            case 3:
                return "bg-blue-500"; // Strong
            case 4:
            case 5:
                return "bg-green-500"; // Very Strong
            default:
                return "bg-red-500";
        }
    };

    return (
        <div>
            <div className="relative mb-2">
                <div className={`h-2 rounded-full ${getStrengthColor(strength)}`} style={{ width: `${(strength / 5) * 100}%` }}></div>
            </div>
            <p className={`text-sm ${getStrengthColor(strength)} font-semibold`}>
                {getStrengthText(strength)}
            </p>
        </div>
    );
};

export default PasswordStrengthMeter;
