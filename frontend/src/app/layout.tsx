// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { AppProvider } from "@/context/AppContext";
import ChatbotClient from "@/components/chatbot/ChatbotClient";

export const metadata: Metadata = {
  title: "NexHire",
  description: "AI-powered job matching platform. Find your next career opportunity with smart recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NavBar />
            {children}
            <ChatbotClient />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
