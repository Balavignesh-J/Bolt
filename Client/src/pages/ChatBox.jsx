import { useEffect, useRef, useState } from "react";
import { ImageIcon, SendHorizonal } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import {
  addMessage,
  fetchMessages,
  resetMessages,
} from "../features/messages/messagesSlice";
import toast from "react-hot-toast";

const Chatbox = () => {
  const connections = useSelector((state) => state.connections.connections);
  const { messages } = useSelector((state) => state.messages);
  const { userId } = useParams();
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const messageEndRef = useRef(null);

  const fetchUserMessages = async () => {
    try {
      const token = await getToken();
      dispatch(fetchMessages({ token, userId }));
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async () => {
    try {
      if (!text && !image) return;

      const token = await getToken();
      const formData = new FormData();
      formData.append("to_user_id", userId);
      formData.append("text", text);
      if (image) formData.append("image", image);

      const { data } = await api.post("/api/message/send", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setText("");
        setImage(null);
        dispatch(addMessage(data.message));
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchUserMessages();
    return () => {
      dispatch(resetMessages());
    };
  }, [userId]);

  useEffect(() => {
    if (connections.length > 0) {
      const user = connections.find((connection) => connection._id === userId);
      setUser(user);
    }
  }, [connections, userId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    user && (
      <div className="flex flex-col h-full bg-white/40 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 md:px-10 xl:pl-8 border-b border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-slate-100">
          <img
            src={user.profile_picture}
            alt=""
            className="size-8 rounded-full shadow"
          />
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 -mt-1">@{user.username}</p>
          </div>
        </div>
        {/* Messages container */}
        <div className="p-5 md:px-10 h-full overflow-y-scroll">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.to_user_id !== user._id ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`p-3 text-sm max-w-sm backdrop-blur-xl shadow-md rounded-2xl transition-all duration-200 ${message.to_user_id !== user._id ? "bg-white/60 dark:bg-white/10 text-slate-800 dark:text-slate-200 rounded-bl-none border border-white/40 dark:border-white/10" : "bg-indigo-500/90 dark:bg-indigo-600/90 text-white rounded-br-none border border-indigo-400/30"}`}
                  >
                    {message.message_type === "image" && (
                      <img
                        src={message.media_url}
                        alt=""
                        className="w-full max-w-sm rounded-lg mb-1"
                      />
                    )}
                    {message.text && <p>{message.text}</p>}
                  </div>
                </div>
              ))}
            <div ref={messageEndRef} />
          </div>
        </div>
        <div className="px-4">
          <div className="flex items-center gap-3 pl-5 p-1.5 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl w-full max-w-xl mx-auto shadow-xl rounded-2xl mb-5 transition-all duration-300">
            <input
              type="text"
              className="text-slate-800 dark:text-slate-200 outline-none flex-1 bg-transparent placeholder:text-slate-500 dark:placeholder:text-slate-400"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key == "Enter" && sendMessage()}
            />
            <label htmlFor="image" className="cursor-pointer">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt=""
                  className="h-8 rounded"
                />
              ) : (
                <ImageIcon className="size-7 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors" />
              )}
              <input
                type="file"
                id="image"
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <button
              onClick={sendMessage}
              className="bg-indigo-500 hover:bg-indigo-600 text-white dark:bg-white dark:text-slate-900 shadow-md active:scale-95 cursor-pointer p-2 rounded-xl transition-all duration-200"
            >
              <SendHorizonal size={18} />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default Chatbox;
