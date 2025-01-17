import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";

export default function Home() {
  return (
    <div className="relative flex h-screen bg-[#0A0A0B] text-zinc-100 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A0A0B_0%,rgba(10,10,11,0.8)_30%,rgba(10,10,11,0.8)_70%,#0A0A0B_100%)] pointer-events-none" />

      <ChatSidebar />
      <div className="flex-1 flex flex-col">
        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessages />
        </div>

        {/* Chat input box (fixed at the bottom) */}
        <div className="flex-shrink-0 p-4 bg-[#1C1C1C]">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
