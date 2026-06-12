import { useState } from "react";

import SideBar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {

    const[selectedSessionId, setSelectedSessionId] = useState(null);

    const[refreshSessions, setRefreshSessions] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div style={{ display: "flex", height: "100vh"}}>

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
            />

            <ChatWindow 
                sessionId={selectedSessionId} 
                setRefreshSessions={setRefreshSessions} 
            />

        </div>
    );
}

export default Chat;