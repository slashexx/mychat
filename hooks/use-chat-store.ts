import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chat, Message } from '@/lib/types';

interface ChatStore {
  chats: Chat[];
  currentChatId: string | null;
  addChat: (context?: string, language?: string) => void;
  addMessage: (chatId: string, message: Omit<Message, 'id'>) => void;
  setCurrentChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  updateChatContext: (chatId: string, context: string) => void;
  updateChatLanguage: (chatId: string, language: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      chats: [],
      currentChatId: null,
      addChat: (context = 'general', language = 'typescript') => {
        const newChat: Chat = {
          id: Math.random().toString(36).substring(7),
          title: 'New Chat',
          messages: [],
          createdAt: Date.now(),
          context,
          language,
        };
        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChat.id,
        }));
      },
      addMessage: (chatId, message) => {
        const newMessage: Message = {
          ...message,
          id: Math.random().toString(36).substring(7),
        };
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  title:
                    chat.messages.length === 0 && message.role === 'user'
                      ? message.content.slice(0, 40) + '...'
                      : chat.title,
                }
              : chat
          ),
        }));
      },
      setCurrentChat: (chatId) => set({ currentChatId: chatId }),
      deleteChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== chatId),
          currentChatId:
            state.currentChatId === chatId
              ? state.chats[0]?.id || null
              : state.currentChatId,
        })),
      updateChatContext: (chatId, context) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, context } : chat
          ),
        })),
      updateChatLanguage: (chatId, language) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId ? { ...chat, language } : chat
          ),
        })),
    }),
    {
      name: 'chat-store',
    }
  )
);