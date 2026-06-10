import { useState } from "react";

import SideBar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {

    const[selectedSessionId, setSelectedSessionId] = useState(null);

    const[refreshSessions, setRefreshSessions] = useState(false);

    return (

        <div style={{ display: "flex", height: "100vh"}}>

            <SideBar
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
                refreshSessions={refreshSessions}
            />

            <ChatWindow 
                sessionId={selectedSessionId} 
                setRefreshSessions={setRefreshSessions} 
            />

        </div>
    );
}

export default Chat;