import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Signup.css";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = Validation("", formData);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            toast.error("Please enter valid values");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();

                // Save user data to localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                toast.success("Registered successfully!");
                setTimeout(() => navigate("/"), 1000);
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || "Registration failed");
            }
        } catch (err) {
            console.error("Error during registration:", err);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="register-page-container">
            <div className="register-box">
                <h2 className="register-title">Register</h2>
                <div className="register-radio-group">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="user"
                            checked={formData.role === "user"}
                            onChange={handleChange}
                        />
                        User
                    </label>
                    <label style={{ marginLeft: '20px' }}>
                        <input
                            type="radio"
                            name="role"
                            value="owner"
                            checked={formData.role === "owner"}
                            onChange={handleChange}
                        />
                        Owner
                    </label>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="register-form-group">
                        <label><strong>Name</strong></label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter Name"
                            autoComplete="off"
                            className="register-input"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors?.name && <span className="register-error">{errors.name}</span>}
                    </div>

                    <div className="register-form-group">
                        <label><strong>Email</strong></label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            className="register-input"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors?.email && <span className="register-error">{errors.email}</span>}
                    </div>

                    <div className="register-form-group">
                        <label><strong>Password</strong></label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter Password"
                            autoComplete="off"
                            className="register-input"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors?.password && <span className="register-error">{errors.password}</span>}
                    </div>

                    <button type="submit" className="register-btn">Register</button>
                </form>

                <p className="register-login-text">Already Have an Account?</p>
                <Link to="/login" className="register-login-btn">Login</Link>
            </div>
            <ToastContainer />
        </div>
    );
}
