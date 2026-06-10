import {useState, useEffect, useRef} from "react";
import MessageInput from "./MessageInput";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";
import { FaCopy } from "react-icons/fa";

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

        alert("AI response copied to clipboard!");
    };

    const likeMessage = async(id) => {

        try {

            await api.put(`/chat/${id}/like`);

            loadMessages();
        }
        catch(error) {

            console.error(error);
        }
    };

    const dislikeMessage = async(id) => {

        try {

            await api.put(`/chat/${id}/dislike`);

            loadMessages();
        }
        catch(error) {

            console.error(error);
        }
    };

    return (

        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>

            <h2>Chat Area</h2>

            {messages.length === 0 ? (

                <div>

                    <h3>Welcome to Enterprise AI Copilot</h3>

                    <p>Start a new conversation.</p>

                </div>
            ) : (

            messages.map((msg) => (

                <div key={msg.id}>

                    <p>
                        <strong>You:</strong> 
                        {" "}
                        {msg.userMessage}
                    </p>

                    <div>

                        <strong>AI:</strong> 

                        <button
                            onClick={() => 
                                copyResponse(msg.aiResponse)
                            }
                        >
                            <FaCopy />
                        </button>

                        <button 
                            onClick={() => likeMessage(msg.id)}
                            style={{
                                marginLeft: "10px"
                            }}
                        >
                            {msg.liked === true ? "👍" : "👍🏻"}
                        </button>

                        <button
                            onClick={() => dislikeMessage(msg.id)}
                            style={{
                                marginLeft: "5px"
                            }}
                        >
                            {msg.disliked === true ? "👎" : "👎🏻"}
                        </button>

                        <ReactMarkdown>
                            {msg.aiResponse}
                        </ReactMarkdown>

                    </div>

                    <hr />
                </div>
            ))

        )}

            {loading && (
                <p>AI is thinking...</p>
            )}

            <div ref={messagesEndRef}></div>

            <MessageInput onSend={sendMessage} />

        </div>
    );
}

export default ChatWindow;