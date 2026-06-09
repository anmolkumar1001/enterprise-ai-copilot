import { useState } from "react";

function MessageInput({ onSend }) {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        console.log("Send clicked");

        if (!message.trim()) {
            alert("Please enter a message before sending.");
            return;
        }

        onSend(message);

        setMessage("");
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
            />

            <button onClick={handleSend}>
                Send
            </button>
        </div>
    );
}

export default MessageInput;