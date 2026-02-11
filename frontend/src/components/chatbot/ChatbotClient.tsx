// src/components/chatbot/ChatbotClient.tsx
"use client";

import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("./Chatbot"), {
  ssr: false,
});

export default function ChatbotClient() {
  return <Chatbot />;
}
