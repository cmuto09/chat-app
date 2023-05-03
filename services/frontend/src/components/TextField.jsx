import { useState } from "react";

export default function TextField({ messages, setMessages, socket }) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const data = { text: inputValue };
    fetch(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status === "error") {
          console.log("error", responseData);
          return;
        }
        const updatedMessages = [...messages, responseData.message];
        setMessages(updatedMessages);
        setInputValue("");

        socket.emit("new_message", responseData.message);
      });
  }
  function handleTyping(event) {
    setInputValue(event.target.value);
  }
  return (
    <form className="chatInputarea" onSubmit={handleSubmit}>
      <input
        type="text"
        id="message"
        className="chatInput"
        value={inputValue}
        onChange={handleTyping}
      ></input>
      <button className="chatSendBtn" disabled={!inputValue} type='submit'>
        Send
      </button>
    </form>
  );
}
