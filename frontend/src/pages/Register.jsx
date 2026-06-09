import { useState } from "react";
import {useNavigate} from "react-router-dom";
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
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input 
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange} 
                />

                <br /><br />

                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br /><br />
                <button type="submit">Register</button>

            </form>
        </div>
    );

}

export default Register;