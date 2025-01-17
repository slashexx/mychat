"use client";

import { PlusCircle, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useChatStore } from "@/hooks/use-chat-store";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const { chats, currentChatId, addChat, setCurrentChat, deleteChat } = useChatStore();

  return (
    <div className="w-[280px] h-screen bg-black/40 backdrop-blur-xl border-r border-white/[0.08] flex flex-col overflow-x-hidden">
      <Button
        onClick={() => addChat()}
        className="m-3 gap-2 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-indigo-200"
        variant="secondary"
      >
        <PlusCircle className="w-4 h-4" />
        New Chat
      </Button>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-white/[0.06]",
              currentChatId === chat.id && "bg-white/[0.08]"
            )}
          >
            <Button
              variant="ghost"
              className="flex-1 justify-start gap-2 px-2 text-zinc-400 hover:text-zinc-200"
              onClick={() => setCurrentChat(chat.id)}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="break-words">{chat.title}</span> {/* Allow multi-line text */}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-zinc-200"
              onClick={() => deleteChat(chat.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
