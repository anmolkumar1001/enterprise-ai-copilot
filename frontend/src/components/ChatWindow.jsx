import {useState, useEffect, useRef} from "react";
import MessageInput from "./MessageInput";
import api from "../api/axiosConfig";
import ReactMarkdown from "react-markdown";
import { FaCopy } from "react-icons/fa";
import "../styles/chat.css";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import ProfileDropdown from "./ProfileDropdown";
import jsPDF from "jspdf";
import { WiAlien } from "react-icons/wi";

function ChatWindow({ sessionId, setRefreshSessions, theme, setTheme }) {

    const[messages, setMessages] = useState([]);
    const[loading, setLoading] = useState(false);
    const[typingMessageId, setTypingMessageId] = useState(null);

    const[documents, setDocuments] = useState([]);

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

    useEffect(() => {

        if(sessionId) {
            loadDocuments();
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

    const animateResponse = (chat) => {

        let index = 0;

        const fullText = chat.aiResponse; // "Hello, how are you?" (complete text)

        // marks this message as "currently typing"
        // used to show a blinking cursor or loading indicator in UI
        setTypingMessageId(chat.id);

        const interval = setInterval(() => {

            index++;

            setMessages(prev => 
                prev.map(msg => 
                    msg.id === chat.id // find the correct message
                        ? {
                            ...msg,
                            aiResponse: fullText.substring(0, index) // slice text
                        }
                        : msg // other messages stay unchanged
                )
            );

            if(index >= fullText.length) {

                clearInterval(interval); // STOP the timer
                
                setTypingMessageId(null); // remove typing indicator
            }
        }, 10); // runs every 10 milliseconds
        // Every 10ms:
        // index = 1 → "H"
        // index = 2 → "He"
        // index = 3 → "Hel"
        // ... and so on
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

            // setMessages(prev => [...prev, response.data]);
            const chat = {
                ...response.data,
                aiResponse: ""
            };

            setMessages(prev => [...prev, chat]);

            animateResponse(response.data);

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

    const exportChatAsTxt = () => {

        let content = "";

        messages.forEach((msg) => {

            content += `User:\n${msg.userMessage}\n\n`;
            content += `AI:\n${msg.aiResponse}\n\n`;
            content += "---------------------------------\n\n";
        });

        // Convert the text string into a Blob (binary file-like object)
        const blob = new Blob(
            [content],
            {type: "text/plain"}
        );

        // Create a temporary URL pointing to the Blob file
        // This URL can be used to download the file
        const url = window.URL.createObjectURL(blob);

        // Create a fake invisible <a> (anchor/link) element in the DOM
        const link = document.createElement("a");

        // Set the link's href to the blob URL (the file to download)
        link.href = url;

        // Set the filename for the downloaded file
        link.download = "chat-history.txt";

        link.click();

        // Clean up — revoke the blob URL to free up browser memory
        // The URL is no longer needed after the download starts
        window.URL.revokeObjectURL(url);
    };

    const exportChatAsPdf = () => {

        const doc = new jsPDF();

        // 'y' is the vertical position (in mm) where text will be printed
        // Start at y=10 (10mm from the top of the page)
        let y = 10;

        messages.forEach((msg, index) => {

            
            const userText = String(msg.userMessage || "");
            const aiText = String(msg.aiResponse || "");

            const userLines = doc.splitTextToSize(
                `User: ${userText}`,
                180
            );

            doc.text(userLines, 10, y);

            y += userLines.length * 8;

            // Split the AI response into multiple lines so it fits within page width
            // 180 = max width in mm (A4 page is 210mm, minus margins = ~180mm)
            // This prevents text from going off the right edge of the page
            const aiLines = doc.splitTextToSize(
                `AI: ${aiText}`,
                180
            );

            // Print all the AI response lines starting at current y position
            doc.text(aiLines, 10, y);

            // Move y down based on how many lines the AI response took
            // Each line takes 8mm of vertical space
            y += aiLines.length * 8;

            doc.text(
                "-------------------------",
                10,
                y
            );

            y += 10;

            // Check if we're near the bottom of the page (270mm is close to A4 bottom)
            // A4 page height is 297mm, so 270 gives a small bottom margin
            if(y > 270) {
                doc.addPage();
                y = 10;
            }
        });

        doc.save("chat-history.pdf");
    };

    const uploadPdf = async(event) => {

        const file = event.target.files[0];

        if(!file) {
            return;
        }

        const formData = new FormData();

        formData.append("file", file);
        formData.append("sessionId", sessionId);

        try {

            const response = await api.post(
                "/documents/upload",
                formData,
                {
                    headers: {
                        "Content-Type" : "multipart/form-data"
                    }
                }
            );

            console.log(response.data);

            alert("PDF uploaded seccessfully!");

            loadDocuments();
        }
        catch(error) {

            console.log(error);

            alert("Failed to upload PDF");
        }
    };

    const loadDocuments = async () => {

        try {

            const response = await api.get(`/documents/${sessionId}`);

            setDocuments(response.data);
        }
        catch(error) {

            console.error(error);
        }
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

    const regenerateResponse = async(id) => {

        try {

            const response = await api.put(
                `/chat/${id}/regenerate`
            );

            const animatedChat = {
                ...response.data,
                aiResponse: ""
            };

            setMessages(prev =>
                prev.map(msg => 
                    msg.id === id
                        ? animatedChat
                        : msg
                )
            );

            animateResponse(response.data);
        }
        catch(error) {

            console.log(error);
            alert("Failed to regenerate response");
        }
    };

    const deleteMessage = async(id) => {

        try {

            await api.delete(`/chat/${id}`)

            setMessages(prev => 
                prev.filter(msg => msg.id !== id)
            );
        }
        catch(error) {

            console.error(error);

            alert("Failed to delete message");
        }
    };

    return (

        <div style={{ 
                flex: 1, 
                display: "flex",
                flexDirection: "column",
                background: 
                    theme === "dark"
                        ? "#0f172a"
                        : "#f8fafc",
                minHeight: "100vh",
                width: "100%"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    padding: "15px 20px",
                    borderBottom: 
                        theme === "dark"
                            ? "1px solid #334155"
                            : "1px solid #e5e7eb",
                    background:
                        theme === "dark" 
                            ? "#0f172a"
                            : "#ffffff",
                }}
            >
                <ProfileDropdown
                    theme={theme}
                    setTheme={setTheme} 
                />
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "20px"
                }}
            >

                {messages.length > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            padding: "10px",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >

                        <label
                            style={{
                                padding: "10px 15px",
                                borderRadius: "8px",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            📤 Upload PDF

                        <input
                            type="file"
                            accept=".pdf"
                            onChange={uploadPdf}
                            style={{ display: "none" }}
                        />
                        </label>

                        <button
                            onClick={exportChatAsTxt}
                            style={{
                                padding: "10px 15px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#16a34a",
                                color: "white",
                                cursor: "pointer"
                            }}
                        >
                            📄 Export TXT
                        </button>

                        <button
                            onClick={exportChatAsPdf}
                            style={{
                                padding: "10px 15px",
                                border: "none",
                                borderRadius: "8px",
                                background: "#dc2626",
                                color: "white",
                                cursor: "pointer",
                                marginLeft: "10px"
                            }}
                        >
                            📄 Export PDF
                        </button>
                    </div>
                )}

                {sessionId && documents.length > 0 && (
                    <div
                        style={{
                            margin: "10px 0",
                            padding: "10px",
                            background:
                                theme === "dark"
                                    ? "#1e293b"
                                    : "#f8fafc",
                            borderRadius: "8px"
                        }}
                    >
                        <h4>Uploaded Documents</h4>

                        {documents.map(doc => (
                            <div
                                key={doc.id}
                                style={{
                                    padding: "5px 0"
                                }}
                            >
                                📄 {doc.fileName}
                            </div>
                        ))}
                    </div>
                )}

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
                        <h1 
                            style={{
                                color: theme === "dark" ? "white" : "#111827"
                            }}
                        >
                            🤖 Enterprise AI Copilot</h1>

                        <p 
                            style={{
                                color: theme === "dark"
                                    ? "#cbd5e1"
                                    : "#6b7280"
                            }}
                        >
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
                                background:
                                    theme === "dark"
                                        ? "#1e293b"
                                        : "#ffffff",
                                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                                color:
                                    theme === "dark"
                                        ? "#f8fafc"
                                        : "#333",
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
                                        background:
                                            theme === "dark"
                                                ? "#334155"
                                                : "#f5f5f5",
                                        color:
                                            theme === "dark"
                                                ? "white"
                                                : "#333",
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
                                        background:
                                            theme === "dark"
                                                ? "#334155"
                                                : "#f5f5f5",
                                        color:
                                            theme === "dark"
                                                ? "white"
                                                : "#333",
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
                                        background:
                                            theme === "dark"
                                                ? "#334155"
                                                : "#f5f5f5",
                                        color:
                                            theme === "dark"
                                                ? "white"
                                                : "#333",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginLeft: "5px"
                                    }}
                                    onClick={() => dislikeMessage(msg.id)}
                                        
                                >
                                    {msg.disliked === true ? "👎" : "👎🏻"}
                                </button>

                                <button
                                    onClick={() =>
                                        regenerateResponse(msg.id)
                                    }
                                    style={{
                                        border: "none",
                                        background: "#f5f5f5",
                                        padding: "6px 10px",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        marginLeft: "5px"
                                    }}
                                >
                                    🔄
                            </button>
                            
                            <button
                                onClick={() => deleteMessage(msg.id)}
                                style={{
                                    border: "none",
                                    background: "#f5f5f5",
                                    padding: "6px 10px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    marginLeft: "5px"
                                }}
                            >
                                🗑️
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
                                {(msg.aiResponse || "") +
                                    (typingMessageId === msg.id ? "▋" : "")
                                }
                            </ReactMarkdown>
                            
                        </div>
                    </div>

                </div>
            ))

        )}

            {loading && (
                <div
                    style={{
                        background:
                            theme === "dark"
                                ? "#1e293b"
                                : "#ffffff",

                        color:
                            theme === "dark"
                            ? "white"
                            : "#333",
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
                    background:
                        theme === "dark"
                            ? "#1e293b"
                            : "#ffffff",

                    borderTop:
                        theme === "dark"
                            ? "1px solid #334155"
                            : "1px solid #ddd",
                    boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
                }}
            >
                <MessageInput onSend={sendMessage} />
            </div>

        </div>
    );
}

export default ChatWindow;