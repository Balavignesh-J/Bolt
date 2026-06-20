import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Sparkles, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios";
import { addAiMessage } from "../features/aiChat/aiChatSlice";
import toast from "react-hot-toast";

const AiChatBox = () => {
  const messages = useSelector((state) => state.aiChat.messages);
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  const sendMessage = async () => {
    try {
      if (!text.trim()) return;

      const userMessage = { role: "user", content: text.trim() };
      dispatch(addAiMessage(userMessage));
      setText("");
      setLoading(true);

      const conversationHistory = [...messages, userMessage];

      const { data } = await api.post("/api/chat", {
        messages: conversationHistory.map(m => ({ role: m.role, content: m.content }))
      });

      if (data.success) {
        dispatch(addAiMessage({ role: "assistant", content: data.reply }));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch AI response");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 md:px-10 xl:pl-8 border-b border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-slate-100">
        <div className="size-8 rounded-full shadow bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="font-medium">AI Assistant</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">@assistant</p>
        </div>
      </div>
      {/* Messages container */}
      <div className="p-5 md:px-10 h-full overflow-y-scroll">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col ${message.role === "assistant" ? "items-start" : "items-end"}`}
            >
              <div
                className={`p-3 text-sm max-w-sm backdrop-blur-xl shadow-md rounded-2xl transition-all duration-200 ${message.role === "assistant" ? "bg-white/60 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-bl-none border border-white/40 dark:border-white/10" : "bg-indigo-500/90 dark:bg-indigo-600/90 text-white rounded-br-none border border-indigo-400/30"}`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex flex-col items-start">
              <div className="p-3 text-sm max-w-sm backdrop-blur-xl shadow-md rounded-2xl transition-all duration-200 bg-white/60 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-bl-none border border-white/40 dark:border-white/10 flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messageEndRef} />
        </div>
      </div>
      <div className="px-4">
        <div className="flex items-center gap-3 pl-5 p-1.5 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl w-full max-w-xl mx-auto shadow-xl rounded-2xl mb-5 transition-all duration-300">
          <input
            type="text"
            className="text-slate-800 dark:text-slate-200 outline-none flex-1 bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400"
            placeholder="Ask anything..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key == "Enter" && !loading && sendMessage()}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white dark:bg-white dark:text-slate-900 shadow-md active:scale-95 cursor-pointer p-2 rounded-xl transition-all duration-200"
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;
