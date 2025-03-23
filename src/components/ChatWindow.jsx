import { useState } from "react";
import agents from "../agents/agents";
import { getAgentResponse } from "../agents/openai";

function ChatWindow() {
  const [messages, setMessages] = useState([
    { sender: "Sam", text: "Welcome to the group. I'm glad you're here." },
    { sender: "Ivy", text: "Hi, I'm Ivy. I’m in recovery from opioids." },
    { sender: "Jordan", text: "Hey, I’m Jordan. Cocaine used to be my escape." },
    { sender: "Leo", text: "I’m Leo. Alcohol and PTSD nearly took me out." }
  ]);

  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    const newUserMessage = { sender: "You", text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setLoading(true);

    for (const agent of agents) {
      try {
        const reply = await getAgentResponse(agent, userInput);
        setMessages(prev => [...prev, { sender: agent.name, text: reply }]);
      } catch (err) {
        setMessages(prev => [...prev, { sender: agent.name, text: "Sorry, I had trouble replying." }]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-md ${msg.sender === "You" ? "bg-blue-200 self-end" : "bg-white self-start"} shadow`}
          >
            <p className="text-xs text-gray-500 font-semibold">{msg.sender}</p>
            <p className="text-base text-gray-800">{msg.text}</p>
          </div>
        ))}
        {loading && <p className="text-gray-500 italic">The group is responding...</p>}
      </div>

      <div className="p-4 border-t bg-white flex">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 mr-2"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
