import {useState, useEffect, useRef} from "react";
import MessageInput from "./MessageInput";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";
import { FaCopy } from "react-icons/fa";
import "../styles/chat.css";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import ProfileDropdown from "./ProfileDropdown";

function ChatWindow({ sessionId, setRefreshSessions }) {

    const[messages, setMessages] = useState([]);
    const[loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {

        if(sessionId) {
            loadMessages();
        }
        else {
            setMessages([]);
        }
    }, [sessionId]);

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const loadMessages = async () => {

        try {

            const response = await api.get(
                `/chat/sessions/${sessionId}/messages`
            );

            setMessages(response.data);
        }
        catch(error) {

            console.error(error);
        }
    };

    const sendMessage = async (message) => {

        if(!sessionId) {
            alert("Please create a new chat first.");
            return;
        }

        console.log("Message:", message);

        setLoading(true);

        try {

            const response = await api.post(
                `/chat/sessions/${sessionId}/messages`,
                {
                    title: "Chat",
                    message: message
                }
            );

            console.log(response.data);

            setMessages(prev => [...prev, response.data]);

            setRefreshSessions(prev => !prev);
        }
        catch(error) {

            console.error(error);
            alert("Failed to send message. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };

    const copyResponse = (text) => {

        navigator.clipboard.writeText(text);

        // alert("Copied to clipboard!");
    };

    const likeMessage = async(id) => {

        try {

            await api.put(`/chat/${id}/like`);

            setMessages(prev => 
                prev.map(msg => 
                    msg.id === id
                        ? {
                            ...msg,
                            liked: true,
                            disliked: false
                        }
                        : msg
                )
            );
        }
        catch(error) {

            console.error(error);
        }
    };

    const dislikeMessage = async(id) => {

        try {

            await api.put(`/chat/${id}/dislike`);

            setMessages(prev => 
                prev.map(msg => 
                    msg.id === id
                        ? {
                            ...msg,
                            liked: false,
                            disliked: true
                        }
                        : msg
                )
            );
        }
        catch(error) {

            console.error(error);
        }
    };

    return (

        <div style={{ 
                flex: 1, 
                display: "flex",
                flexDirection: "column",
                background: "#0f172a",
                minHeight: "100vh",
                width: "100%"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "15px 20px",
                    borderBottom: "1px solid #334155",
                    background: "#0f172a"
                }}
            >
                <ProfileDropdown />
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px"
                }}
            >

                {messages.length === 0 ? (

                    <div
                        style={{
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "80vh",
                            textAlign: "center",
                        }}
                    >
                        <h1>🤖 Enterprise AI Copilot</h1>

                        <p style={{color: "#cbd5e1"}}>
                            Start a new conversation or select an existing session.
                        </p>
                    </div>
                ) : (

                messages.map((msg) => (

                    <div key={msg.id}>

                        {/* User Message */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginBottom: "10px"
                            }}
                        >
                            <div
                                style={{
                                    
                                    background: "#0d6efd",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                                    color: "white",
                                    padding: "12px",
                                    borderRadius: "15px",
                                    maxWidth: "70%",
                                    wordBreak: "break-word"
                                }}
                            >
                                {msg.userMessage}
                            </div>
                        </div>

                    {/* AI Message */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            marginBottom: "20px"
                        }}
                    >

                        <div
                            style={{
                                background: "#ffffff",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                color: "#333",
                                lineHeight: "1.6",
                                padding: "12px",
                                borderRadius: "15px",
                                maxWidth: "70%",
                                wordBreak: "break-word"
                            }}
                        >

                            <div
                                style={{
                                    marginBottom: "10px"
                                }}
                            >

                                <button
                                    style={{
                                        border: "none",
                                        background: "#f5f5f5",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                        onClick={() =>
                                            copyResponse(msg.aiResponse)
                                        }
                                >
                                    <FaCopy />
                                </button>

                                <button

                                    style={{
                                        border: "none",
                                        background: "#f5f5f5",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginLeft: "10px"
                                    }}
                                    onClick={() => likeMessage(msg.id)}
                                >
                                    {msg.liked === true ? "👍" : "👍🏻"}
                                </button>

                                <button

                                    style={{
                                        border: "none",
                                        background: "#f5f5f5",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginLeft: "5px"
                                    }}
                                    onClick={() => dislikeMessage(msg.id)}
                                        
                                >
                                    {msg.disliked === true ? "👎" : "👎🏻"}
                                </button>

                            </div>

                            <ReactMarkdown
                                components={{
                                    code({ className, children }) {

                                        return (
                                            <pre
                                                style={{
                                                    background: "#1e1e1e",
                                                    color: "white",
                                                    padding: "12px",
                                                    borderRadius: "8px",
                                                    overflowX: "auto",
                                                    whiteSpace: "pre-wrap"
                                                }}
                                            >
                                                <code>{String(children)}</code>
                                            </pre>
                                        );
                                    }
                                }}
                            >
                                {msg.aiResponse}
                            </ReactMarkdown>
                            

                        </div>
                    </div>

                </div>
            ))

        )}

            {loading && (
                <div
                    style={{
                        background: "#ffffff",
                        padding: "12px",
                        borderRadius: "12px",
                        width: "fit-content",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
                    }}
                >
                    🤖 AI is thinking...
                </div>
            )}

            <div ref={messagesEndRef}></div>

            </div>

            <div
                style={{
                    padding: "20px",
                    borderTop: "1px solid #ddd",
                    background: "#ffffff",
                    boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
                }}
            >
                <MessageInput onSend={sendMessage} />
            </div>

        </div>
    );
}

export default ChatWindow;