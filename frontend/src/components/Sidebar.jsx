import api from "../api/axiosConfig";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function Sidebar({ selectedSessionId, setSelectedSessionId, refreshSessions, sidebarOpen, setSidebarOpen }) {

    const [sessions, setSessions] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");

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

    const renameSession = async(sessionId, currentTitle) => {

        const newTitle = prompt("Enter new session title:", currentTitle);

        if(!newTitle || newTitle.trim() === "") {
            return;
        }

        try {

            await api.put(`/sessions/${sessionId}/rename?title=${encodeURIComponent(newTitle)}`);

            setSessions(prev => 
                prev.map(session => 
                    session.id === sessionId ? {...session, title: newTitle} : session
                )
            );
        }
        catch(error) {

            console.error(error);

            alert("Failed to rename session");
        }
    };

    const filteredSessions = sessions.filter(session => 
        session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const logout = () => {

        localStorage.removeItem("token");

        navigate("/");
    };

    return (

        <div 
            className={`sidebar ${sidebarOpen ? "open" : ""}`}
            style={{ 
                width: "280px", 
                borderRight: "1px solid #ddd", 
                padding: "15px", 
                background: "#1e293b", 
                color: "white"
            }}
        >

            <h3 style={{ color: "white"}}>Sessions</h3>

            <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    border: "1px solid #555",
                    background: "#334155",
                    color: "white",
                    boxSizing: "border-box"
                }} 
            />

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

            {filteredSessions.length === 0 && (
                <p
                    style={{
                        textAlign: "center",
                        color: "#94a3b8",
                        marginTop: "20px"
                    }}
                >
                    No sessions found
                </p>
            )}

            {filteredSessions.map((session) => (
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



                    <div
                        style={{
                            display: "flex",
                            gap: "5px"
                        }}
                    >

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                renameSession(
                                    session.id,
                                    session.title
                                );
                            }}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            ✏️
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
                            }}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer"
                            }}
                        >
                            ❌
                        </button>

                    </div>

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