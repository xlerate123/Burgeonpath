// ChatBotUI.tsx - TypeScript version
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle, Bot, User } from "lucide-react";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  isError?: boolean;
}

interface ChatBotUIProps {
  originalAnalysis: string;
  onAnalysisUpdate?: (updatedReport: any) => void;
}

export default function ChatBotUI({ originalAnalysis, onAnalysisUpdate }: ChatBotUIProps) {
  // Your backend URL - update this to match your server
  const BACKEND_URL = "http://localhost:5000/api/v1/profiles/chat-modify";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hi! I'm your AI assistant. Ask me to modify your profile analysis or suggest improvements. For example: 'Make the tone more professional' or 'Add more emphasis on leadership skills'",
    },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMessage("");

    const userText = inputValue.trim();
    if (!userText) return;

    // Validate that we have the original analysis
    if (!originalAnalysis) {
      setErrorMessage("No analysis data available. Please refresh the page.");
      return;
    }

    console.log("Sending request with:", {
      userRequest: userText,
      analysisLength: originalAnalysis.length,
      analysisPreview: originalAnalysis.substring(0, 100)
    });

    // Add user message immediately
    const userMsg: Message = {
      id: Date.now(),
      from: "user",
      text: userText,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      console.log("Fetching:", BACKEND_URL);
      console.log("Request body:", {
        userRequest: userText,
        originalAnalysis: originalAnalysis.substring(0, 200) + "..."
      });

      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userRequest: userText,
          originalAnalysis: originalAnalysis,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error response:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Success response:", data);

      // Add bot response
      if (data.success && data.chatbotResponse) {
        const botMsg: Message = {
          id: Date.now() + 1,
          from: "bot",
          text: data.chatbotResponse,
        };
        setMessages((prev) => [...prev, botMsg]);

        // If analysis was updated, notify parent component
        if (data.updatedReport && onAnalysisUpdate) {
          onAnalysisUpdate(data.updatedReport);
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = err instanceof Error ? err.message : "Unknown error occurred";
      setErrorMessage(
        errorMsg || "Failed to send message. Please check your connection and try again."
      );

      // Add error message to chat
      const errorChatMsg: Message = {
        id: Date.now() + 2,
        from: "bot",
        text: "Sorry, I encountered an error processing your request. Please try again.",
        isError: true,
      };
      setMessages((prev) => [...prev, errorChatMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-border overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-primary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">AI Assistant</div>
            <div className="text-xs text-white/80">Ask me to modify your analysis</div>
          </div>
        </div>
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border-b border-red-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage("")}
            className="px-3 py-1 text-xs border border-red-300 rounded hover:bg-red-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* MESSAGES */}
      <div className="h-[400px] overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3 ${m.from === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.from === "bot"
                  ? "bg-gradient-primary"
                  : "bg-blue-500"
              }`}
            >
              {m.from === "bot" ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                m.from === "bot"
                  ? m.isError
                    ? "bg-red-100 border border-red-200 text-red-800"
                    : "bg-white border border-border shadow-sm"
                  : "bg-blue-500 text-white"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isSending && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-border rounded-2xl px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white">
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm outline-none border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            placeholder="Ask me to modify the analysis..."
            disabled={isSending}
            rows={1}
            style={{ minHeight: "44px", maxHeight: "120px" }}
            onInput={(e: React.FormEvent<HTMLTextAreaElement>) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "44px";
              target.style.height = target.scrollHeight + "px";
            }}
          />

          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className="px-4 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="text-sm">Send</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </form>
    </div>
  );
}