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

        <div style={{ width: "300px", borderRight: "1px solid gray", padding: "10px"}}>

            <h3>Sessions</h3>

            <button onClick={createSession}>+ New Chat</button>

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
                        cursor: "pointer",
                        background:
                           selectedSessionId === session.id 
                            ? "#ddd"
                            : "transparent"
                    }} 
                >

                    <span
                        style={{
                            cursor: "pointer",
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
                    >
                       ❌     
                    </button>

                </div>
            ))}

            <hr />

            <button onClick={logout}>Logout</button>

        </div>
    );
}

export default Sidebar;