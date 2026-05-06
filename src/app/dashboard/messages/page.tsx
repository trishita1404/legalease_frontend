"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { AxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Send,
  MoreVertical,
  Search,
  CheckCheck,
} from "lucide-react";

import type { FormEvent } from "react";

const socket = io("https://legalease-backend-d2yt.onrender.com");

interface ApiError {
  status?: string;
  message?: string;
}

interface CaseType {
  _id: string;
  client: { _id: string; fullName: string };
  lawyer: { _id: string; fullName: string };
}

interface MessageType {
  _id?: string;
  text: string;
  sender: string | {
    _id: string;
    fullName: string;
  };
  isRead?: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const { user, logout } = useAuthStore();

  const [chatList, setChatList] = useState<CaseType[]>([]);
  const [activeCase, setActiveCase] = useState<CaseType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);

  // ✅ FIX: Normalize ID
  const currentUserId = user?.id?.toString();

  // ===============================
  // FETCH CHAT LIST
  // ===============================
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get("/users/GetChatList");

        const data = res.data.data;
        setChatList(data);

        // ✅ FIX: ensure valid case for current user
        const validCase = data.find(
          (c: CaseType) =>
            c.client._id === currentUserId ||
            c.lawyer._id === currentUserId
        );

        if (validCase) {
          setActiveCase(validCase);
        }

      } catch (error) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.data?.status === "blocked") {
          setIsBlocked(true);
          logout();
          return;
        }

        console.error("Chat fetch error:", err.message);
      }
    };

    if (currentUserId) fetchChats();
  }, [logout, currentUserId]);

  // ===============================
  // FETCH MESSAGES
  // ===============================
  useEffect(() => {
    if (!activeCase || !currentUserId) return;

    // ✅ SAFETY CHECK
    if (
      activeCase.client._id !== currentUserId &&
      activeCase.lawyer._id !== currentUserId
    ) {
      console.warn("Unauthorized case access prevented");
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/users/GetMessages/${activeCase._id}`);
        setMessages(res.data.data);

      } catch (error) {
        const err = error as AxiosError<ApiError>;

        if (err.response?.data?.status === "blocked") {
          setIsBlocked(true);
          logout();
          return;
        }

        console.error("Message fetch error:", err.message);
      }
    };

    fetchMessages();
    socket.emit("join_case", activeCase._id);

  }, [activeCase, logout, currentUserId]);

  // ===============================
  // SOCKET EVENTS
  // ===============================
  useEffect(() => {
    socket.off("receive_message");

    socket.on("receive_message", (data: { message: MessageType }) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === data.message._id);
        if (exists) return prev;
        return [...prev, data.message];
      });
    });

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
    };
  }, []);

  // ===============================
  // SEND MESSAGE
  // ===============================
  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim() || !activeCase) return;

    try {
      const res = await api.post("/users/SendMessage", {
        caseId: activeCase._id,
        text,
      });

      const newMessage: MessageType = res.data.data;

      socket.emit("send_message", {
        caseId: activeCase._id,
        message: newMessage,
      });

      setText("");

    } catch (error) {
      const err = error as AxiosError<ApiError>;

      if (err.response?.data?.status === "blocked") {
        setIsBlocked(true);
        logout();
        return;
      }

      console.error("Send message error:", err.message);
    }
  };

  if (isBlocked) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            You are blocked by Admin
          </h2>
          <p className="text-muted-foreground mt-2">
            Please contact support.
          </p>
        </div>
      </div>
    );
  }

  const getOtherUser = (c: CaseType) => {
    return user?.role === "client" ? c.lawyer : c.client;
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-[calc(100vh-160px)] rounded-xl border bg-white shadow-sm overflow-hidden">

      {/* SIDEBAR */}
      <div className="w-80 border-r flex flex-col bg-slate-50/30">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          {chatList.map((c) => {
            const other = getOtherUser(c);

            return (
              <button
                key={c._id}
                onClick={() => setActiveCase(c)}
                className={`w-full p-4 text-left ${
                  activeCase?._id === c._id ? "bg-white" : ""
                }`}
              >
                <div className="flex justify-between">
                  <p className="font-bold text-sm">
                    {other.fullName}
                  </p>

                  {onlineUsers.includes(other._id) && (
                    <span className="h-2 w-2 bg-green-500 rounded-full mt-2" />
                  )}
                </div>
              </button>
            );
          })}
        </ScrollArea>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        <div className="p-4 border-b flex justify-between">
          {activeCase && (
            <div>
              <p className="font-bold">
                {getOtherUser(activeCase).fullName}
              </p>

              {onlineUsers.includes(getOtherUser(activeCase)._id) && (
                <p className="text-xs text-green-600">Online</p>
              )}
            </div>
          )}

          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const senderId =
                typeof msg.sender === "string"
                  ? msg.sender
                  : msg.sender._id;

              const isMe = senderId === currentUserId;

              return (
                <div
                  key={msg._id || i}
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex flex-col max-w-[70%]">

                    <div
                      className={`p-3 rounded-xl text-sm ${
                        isMe
                          ? "bg-primary text-white rounded-tr-none"
                          : "bg-slate-100 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <div
                      className={`flex items-center gap-1 text-[10px] mt-1 ${
                        isMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>

                      {isMe && (
                        <CheckCheck
                          className={`h-3 w-3 ${
                            msg.isRead
                              ? "text-blue-500"
                              : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type message..."
            />
            <Button type="submit">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
} 