import { useState } from "react";

import SideBar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

function Chat() {

    const[selectedSessionId, setSelectedSessionId] = useState(5);

    return (

        <div style={{ display: "flex", height: "100vh"}}>

            <SideBar
                selectedSessionId={selectedSessionId}
                setSelectedSessionId={setSelectedSessionId}
            />

            <ChatWindow sessionId={selectedSessionId} />

        </div>
    );
}

export default Chat;