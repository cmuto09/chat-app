import "./App.css";
import Messages from "./components/Messages";
import TextField from "./components/TextField";
import background from './assets/mona-jetpack-background.jpg'

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom'

function App() {
  const [messages, setMessages] = useState([]);
  const [socketInstance, setSocketInstance] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/messages`)
      .then((response) => response.json())
      .then((responseData) => {
        setMessages(responseData);
      });
  }, []);
  useEffect(() => {
    const socket = io(`${process.env.REACT_APP_WEBSOCKET_SERVICE_URL}`, {
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
        withCredentials: true,
      },
    });
    setSocketInstance(socket);

    socket.on("connect", (data) => {
      console.log("socket - connected users:", data);
    });

    socket.on("disconnect", (data) => {
      console.log("socket - disconnect users:", data);
    });

    socket.on("new_message", (data) => {
      const updatedMessages = [...messages, data];
      setMessages(updatedMessages);
    });

    return function cleanup() {
      console.log("clean up");
      socket.disconnect();
    };
  }, [messages]);
  return (
    <div style={
      {
        backgroundImage: `url(${background})`,
        width: "100vw",
        height: "100vh",
        position: "absolute",
        resize: "both",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }
    }>
      <div className="chatWindow">
        <ScrollToBottom className="scrollContainer" scrollViewClassName="messageContainer">
          {messages.length !== 0 ? (
            <Messages messages={messages} />
          ) : (
            <p>No Messages!</p>
          )}
        </ScrollToBottom>
        <div className='messageBar'>
          <TextField
            socket={socketInstance}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
