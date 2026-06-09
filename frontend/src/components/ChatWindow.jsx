import {useState, useEffect} from "react";
import MessageInput from "./MessageInput";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";

function ChatWindow({ sessionId }) {

    const[messages, setMessages] = useState([]);

    useEffect(() => {

        if(sessionId) {
            loadMessages();
        }
    }, [sessionId]);

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

        console.log("Message:", message);

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
        }
        catch(error) {

            console.error(error);
            alert("Failed to send message. Please try again.");
        }

    };

    return (

        <div style={{ flex: 1, padding: "20px"}}>

            <h2>Chat Area</h2>

            {messages.map((msg) => (
                <div key={msg.id}>
                    <p>
                        <strong>You:</strong> {msg.userMessage}
                    </p>

                    <p>
                        <strong>AI:</strong> 
                        <ReactMarkdown>
                            {msg.aiResponse}
                        </ReactMarkdown>
                    </p>

                    <hr />
                </div>
            ))}


            <MessageInput onSend={sendMessage} />

        </div>
    );
}

export default ChatWindow;