import {useState} from 'react';
import {useNavigate, Link} from "react-router-dom";
import api from "../api/axiosConfig";
import "../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const[showPassword, setShowPassword] = useState(false);
    const[loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await api.post("/auth/login", formData);

            localStorage.setItem("token", response.data);

            console.log(response.data);

            navigate("/chat");
        }
        catch(error) {
            console.log(error);

            alert("Login failed. Please check your credentials and try again.");
        }
        finally {

            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">

                <h2 className="auth-title">
                    Enterprise AI Copilot
                </h2>

                <form onSubmit={handleSubmit}>

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
                        Login
                    </button>

                </form>

                <Link
                    className="auth-link"
                    to="/register"
                >
                    Don't have an account? Register
                </Link>

            </div>
        </div>
    );
}

export default Login;