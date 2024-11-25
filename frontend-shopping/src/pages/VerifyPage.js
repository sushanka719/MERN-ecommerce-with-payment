import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authStore";
import styles from "./VerifyPage.module.css"; 
import toast from "react-hot-toast";

const VerifyPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();
    const { verifyEmail, isLoading, error } = useAuth();

    const handleChange = (index, value) => {
        const newCode = [...code];

        // Handle pasted content
        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);

            // Focus on the last non-empty input or the first empty one
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);

            // Move focus to the next input field if value is entered
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("email verification successfully completed");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyForm}>
                <h2 className={styles.verifyTitle}>Verify Your Email</h2>
                <p className={styles.verifyDescription}>
                    Enter the 6-digit code sent to your email address.
                </p>
                <form onSubmit={handleSubmit} className={styles.verifyFormContent}>
                    <div className={styles.inputContainer}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={styles.input}
                            />
                        ))}
                    </div>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                        className={styles.verifyButton}
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerifyPage;
