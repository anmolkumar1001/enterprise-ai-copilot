import { useState } from "react";

function MessageInput({ onSend }) {

    const [message, setMessage] = useState("");

    const handleSend = () => {

        if (!message.trim()) {
            alert("Please enter a message before sending.");
            return;
        }

        onSend(message);

        setMessage("");
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                alignItems: "center"
            }}
        >
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSend();
                    }
                }}
                placeholder="Ask anything..."
                style={{
                    flex: 1,
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    fontSize: "16px",
                    outline: "none"
                }}
            />

            <button
                onClick={handleSend}
                style={{
                    padding: "14px 22px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#2563eb",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Send
            </button>
        </div>
    );
}

export default MessageInput;