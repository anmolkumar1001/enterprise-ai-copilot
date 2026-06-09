import {useState} from 'react';
import {useNavigate, Link} from "react-router-dom";
import api from "../api/axiosConfig";

function Login() {

    const navigate = useNavigate();

    const[formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post("/auth/login", formData);

            localStorage.setItem("token", response.data);

            console.log(response.data);

            navigate("/chat");
        }
        catch(error) {
            console.log(error);
            alert("Login failed. Please check your credentials and try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

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

                <button type="submit">Login</button>

            </form>

            <br />

            <Link to="/register">Don't have an account? Register here.</Link>
        </div>
    );
}

export default Login;