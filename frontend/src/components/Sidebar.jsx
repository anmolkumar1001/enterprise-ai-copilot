import api from "../api/axiosConfig";
import { useState, useEffect } from "react";


function Sidebar({ selectedSessionId, setSelectedSessionId }) {

    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        loadSessions();
    }, []);

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
    }

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
                        padding: "10px",
                        cursor: "pointer",
                        background:
                           selectedSessionId === session.id 
                            ? "#ddd "
                            : "transparent"
                    }} 
                >
                    {session.title}

                </div>
            ))}

        </div>
    );
}

export default Sidebar;