import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import api from "../api/axiosConfig";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            // Spread existing form data to avoid overwriting other fields
            ...formData,
            // Dynamically update only the field that the user is currently typing in
            // e.target.name  → matches the input's name attribute (e.g. "email", "password")
            // e.target.value → the value the user typed
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        // Prevent the browser from reloading the page on form submit (default HTML behavior)
        e.preventDefault();

        try {
            await api.post("/auth/register", formData);
            alert("Registration successful! Please log in.");
            navigate("/"); // Redirect to login page after successful registration
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2 className="auth-title">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="auth-input"
                        type="text"
                        name="name"
                        placeholder="Name"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                    />

                    <input
                        className="auth-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                    />

                    <button
                        className="auth-button"
                        type="submit"
                    >
                        Register
                    </button>

                </form>

                <Link
                    className="auth-link"
                    to="/"
                >
                    Already have an account? Login
                </Link>

            </div>
        </div>
    );

}

export default Register;