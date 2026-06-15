import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProfileDropDown() {

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const username = localStorage.getItem("username") || "User";

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");

        navigate("/");
    };

    return (

        <div
            style={{
                position: "relative"
            }}
        >

            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: "#1e293b",
                    color: "whilte",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer"
                }}
            >
                👤 {username} ▼

            </button>

            {open && (

                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "45px",
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        minWidth: "180px",
                        zIndex: 1000
                    }}
                >

                    <div
                        style={{
                            padding: "12px",
                            borderBottom: "1px solid #eee",
                            color: "#333"
                        }}
                    >
                        {username}
                    </div>

                    <button
                        onClick={logout}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "none",
                            background: "white",
                            cursor: "pointer",
                            textAlign: "left",
                            color: "#dc3545"
                        }}
                    >
                        Logout
                    </button>

                </div>
            )}

        </div>
    );
}

export default ProfileDropDown;