import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css";

function ResetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // Password validation function
    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        if (!validatePassword(password)) {
            toast.error(
                "Password must be at least 6 characters, include 1 uppercase, 1 lowercase, and 1 number."
            );
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/api/auth/reset-password-form", {
                email,
                password,
            });

            if (response.data.status === "Success") {
                toast.success("Password updated successfully!");
                navigate("/login");
            } else {
                toast.error(response.data.message || "Failed to reset password.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h3 className="reset-password-title">Reset Password</h3>
                <form onSubmit={handleSubmit}>
                    <div className="reset-password-form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="reset-password-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="reset-password-form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="reset-password-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <small className="password-hint">
                            Must be 6+ chars, with uppercase, lowercase & number
                        </small>
                    </div>

                    <button type="submit" className="reset-password-btn">Update Password</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
