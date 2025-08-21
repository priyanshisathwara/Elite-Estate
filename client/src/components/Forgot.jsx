import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import './ForgotPassword.css';

function Forgot() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setErrors({ email: "Email is required" });
            return;
        }

        setErrors({});

        axios.post('http://localhost:8000/api/auth/reset-password', { email })
            .then(result => {
                console.log(result)
                toast.success('OTP sended Successfully');
                setTimeout(() => navigate(`/otp-form/${email}`), 1000);
            })
            .catch(err => console.log(err))
        console.log("Submitting email:", email);
    }


    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            autoComplete="off"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <button type="submit" className="send-btn">Send</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};


export default Forgot;
