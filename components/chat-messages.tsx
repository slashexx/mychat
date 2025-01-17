"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/hooks/use-chat-store";
import { Message } from "@/lib/types";
import { cn } from "@/lib/utils";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // Import a theme

export function ChatMessages() {
  const { chats, currentChatId } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  useEffect(() => {
    // Ensure we scroll to the last message on new messages
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Triggered on new messages

  // Copy function for code blocks
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied!");
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  // Function to extract code blocks
  const extractCodeContent = (content: string) => {
    const codeMatch = content.match(/```([\s\S]*?)```/); // Match content inside the code block
    return codeMatch ? codeMatch[1] : ""; // Return the code block content
  };

  // Function to extract non-code content (text outside code blocks)
  const extractTextContent = (content: string) => {
    return content.replace(/```[\s\S]*?```/g, ""); // Remove the code block content, leaving the text
  };

  if (!currentChatId) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        <div className="max-w-md text-center space-y-2">
          <h2 className="text-xl font-semibold text-zinc-300">Welcome to Your AI Assistant</h2>
          <p>Start a new chat or select an existing one to begin the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 max-h-[500px]">
      {/* Render each message */}
      {messages.map((message: Message) => (
        <div
          key={message.id}
          className={cn(
            "flex w-full",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-2xl px-6 py-3 message-glow",
              message.role === "user"
                ? "bg-indigo-500/10 text-indigo-200"
                : "bg-zinc-800/50 text-zinc-200"
            )}
          >
            {/* Render non-code message text */}
            <div>{extractTextContent(message.content)}</div>

            {/* Render the code block if present */}
            {message.content.includes("```") && (
              <div className="relative">
                {/* Render the code block properly with syntax highlighting */}
                <pre className="language-js overflow-x-auto">
                  <code>{extractCodeContent(message.content)}</code>
                </pre>
                {/* Copy button */}
                <button
                  onClick={() => copyToClipboard(extractCodeContent(message.content))}
                  className="absolute top-2 right-2 bg-indigo-500 text-white px-2 py-1 text-xs rounded"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      {/* Scroll to the latest message */}
      <div ref={messagesEndRef} />
    </div>
  );
}
