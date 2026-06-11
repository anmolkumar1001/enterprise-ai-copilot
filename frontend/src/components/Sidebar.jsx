import api from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Sidebar({ selectedSessionId, setSelectedSessionId, refreshSessions }) {

    const [sessions, setSessions] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadSessions();
    }, [refreshSessions]);

    const loadSessions = async () => {
        try {

            const response = await api.get("/sessions");

            setSessions(response.data);
        }
        catch(error) {
            console.error(error);
            alert("Failed to load sessions. Please try again.");
        }
    };

    const createSession = async() => {

        try {

            const response = await api.post("/sessions", {
                title: "New Chat"
            });

            setSessions(prev => [...prev, response.data]);

            setSelectedSessionId(response.data.id);

        }
        catch(error) {

            console.error(error);
            alert("Failed to create session. Please try again.");
        }
    };

    const deleteSession = async (sessionId) => {

        try {

            await api.delete(`/sessions/${sessionId}`);

            setSessions(
                sessions.filter(session => session.id !== sessionId)
            );

            // If currently selected session is deleted
            if(selectedSessionId === sessionId) {

                setSelectedSessionId(null);
            }
        }
        catch(error) {
            console.error(error);
            alert("Failed to delete session. Please try again.");
        }
    };

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (

        <div style={{ width: "280px", borderRight: "1px solid #ddd", padding: "15px", background: "#1e293b", color: "white"}}>

            <h3 style={{ color: "white"}}>Sessions</h3>

            <button 
                onClick={createSession}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                + New Chat
            </button>

            <hr />

            {sessions.map((session) => (
                <div
                    key={session.id}
                    onClick={() => setSelectedSessionId(session.id)}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px",
                        marginTop: "8px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background:
                           selectedSessionId === session.id 
                            ? "#2563eb"
                            : "#334155",
                        color: "white",
                        border: "none",
                        boxShadow:
                            selectedSessionId === session.id
                            ? "0 2px 6px rgba(0,0,0,0.3)"
                            : "none"
                    }} 
                >

                    <span
                        style={{
                            cursor: "pointer",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginRight: "10px"
                        }} 
                        onClick={() => setSelectedSessionId(session.id)}
                    >

                        {session.title}
                    </span>

                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteSession(session.id);
                        }}
                        style={{
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                            fontSize: "14px"
                        }} 
                    >
                       ❌     
                    </button>

                </div>
            ))}

            <hr style={{ borderColor: "#475569" }} />

            <button
                onClick={logout}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#dc3545",
                    color: "white",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>

        </div>
    );
}

export default Sidebar;