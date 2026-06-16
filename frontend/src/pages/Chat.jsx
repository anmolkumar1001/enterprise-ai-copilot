import { useState, useEffect } from "react";

import SideBar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {

    const[selectedSessionId, setSelectedSessionId] = useState(null);

    const[refreshSessions, setRefreshSessions] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    useEffect(() => {

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (

        <div 
            style={{ 
                display: "flex", 
                height: "100vh",
                overflow: "hidden",
                background:
                    theme === "dark"
                        ? "#0f172a"
                        : "#f8fafc"
            }}
        >

            <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: "fixed",
                    top: "15px",
                    left: "15px",
                    zIndex: 1001,
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: window.innerWidth <= 768 ? "block" : "none"
                }}
            >
                ☰
            </button>

            <SideBar
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
                refreshSessions={refreshSessions}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                theme={theme}
            />

            <ChatWindow 
                sessionId={selectedSessionId} 
                setRefreshSessions={setRefreshSessions} 
                theme={theme}
                setTheme={setTheme}
            />

        </div>
    );
}

export default Chat;