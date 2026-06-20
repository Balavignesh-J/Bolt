import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const [messages, setMessages] = useState([]);
  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        const groupedMessages = data.messages.reduce((acc, message) => {
          const senderId = message.from_user_id._id;
          if (
            !acc[senderId] ||
            new Date(message.createdAt) > new Date(acc[senderId].createdAt)
          ) {
            acc[senderId] = message;
          }
          return acc;
        }, {});
        const sortedMessages = Object.values(groupedMessages).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setMessages(sortedMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentMessages();
      const interval = setInterval(fetchRecentMessages, 30000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [user]);

  return (
    <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl max-w-xs mt-4 p-6 min-h-20 rounded-2xl text-xs text-slate-800 dark:text-slate-200 transition-all duration-300">
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4 text-sm">Recent Messages</h3>
      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar space-y-1">
        {messages.map((message, index) => (
          <Link
            key={index}
            to={`/messages/${message.from_user_id._id}`}
            className="flex items-start gap-2 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
          >
            <img
              src={message.from_user_id.profile_picture}
              alt=""
              className="w-8 h-8 rounded-full"
            />
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p className="font-medium text-slate-900 dark:text-slate-100">{message.from_user_id.full_name}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {moment(message.createdAt).fromNow()}
                </p>
              </div>
              <div className="flex justify-between items-center mt-1">
                <p className="text-slate-600 dark:text-slate-300 truncate pr-2">
                  {message.text ? message.text : "Media"}
                </p>
                {!message.seen && (
                  <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                    1
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;
