"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useChatStore } from "@/hooks/use-chat-store";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentChatId, addMessage, chats } = useChatStore();

  const handleSubmit = async () => {
    if (!input.trim() || !currentChatId || isLoading) return;

    const userMessage = {
      content: input.trim(),
      role: "user" as const,
      timestamp: Date.now(),
    };

    addMessage(currentChatId, userMessage);  // Add the user's message to the chat history
    setInput("");
    setIsLoading(true);

    try {
      // Find the current chat and gather the previous messages
      const currentChat = chats.find(chat => chat.id === currentChatId);
      const chatHistory = currentChat?.messages || [];
      
      // Modify the mapping to include both role and content
      const messages = chatHistory.map((message) => ({
        role: message.role,  // Ensure the role is included
        content: message.content,  // And the content
      }));
    
      // Send both the current message and the previous chat history
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          messages: messages,  // Send the previous messages with role and content
        }),
      });
    
      const data = await response.json();
    
      if (data.response) {
        // Add assistant's response to the chat
        addMessage(currentChatId, {
          content: data.response,
          role: "assistant",
          timestamp: Date.now(),
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
    
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-white/[0.08] p-4 backdrop-blur-xl bg-black/40">
      <div className="max-w-3xl mx-auto flex gap-2">
        <div className="flex-1 input-glow rounded-lg">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] bg-white/[0.05] border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20 placeholder:text-zinc-500 rounded-lg resize-none"
            disabled={!currentChatId || isLoading}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!input.trim() || !currentChatId || isLoading}
          className="h-[60px] px-6 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200 disabled:bg-zinc-800/50 disabled:text-zinc-500 transition-all duration-200"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
