import { ChatSidebar } from "@/components/chat-sidebar";
import { ChatMessages } from "@/components/chat-messages";
import { ChatInput } from "@/components/chat-input";

export default function Home() {
  return (
    <div className="relative flex h-screen bg-[#0A0A0B] text-zinc-100 overflow-hidden">
      {/* Animated glow effects */}
      <div className="glow left-1/4 top-0 opacity-30" style={{ animationDelay: "0s" }} />
      <div className="glow right-1/4 bottom-0 opacity-30" style={{ animationDelay: "-4s" }} />
      <div className="glow left-1/3 bottom-1/4 opacity-20" style={{ animationDelay: "-2s" }} />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0A0A0B_0%,rgba(10,10,11,0.8)_30%,rgba(10,10,11,0.8)_70%,#0A0A0B_100%)] pointer-events-none" />
      
      <ChatSidebar />
      <div className="flex-1 flex flex-col backdrop-blur-3xl">
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  );
}