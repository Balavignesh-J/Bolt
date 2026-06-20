import { useNavigate } from "react-router-dom";
import { MessageSquare, EyeIcon } from "lucide-react";
import { useSelector } from "react-redux";

const Messages = () => {
  const { connections } = useSelector((state) => state.connections);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto p-6">
        {/* title  */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Messages</h1>
          <p className="text-slate-600 dark:text-slate-400">Talk to your friends and family</p>
        </div>
        <div className="flex flex-col gap-3">
          {connections.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-wrap gap-5 p-6 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300"
            >
              <img
                src={user.profile_picture}
                alt=""
                className="rounded-full size-12 mx-auto shadow"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-900 dark:text-slate-100">{user.full_name}</p>
                <p className="text-slate-500 dark:text-slate-400">@{user.username}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{user.bio}</p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <button
                  className="size-10 flex items-center justify-center text-sm rounded-xl bg-white/60 dark:bg-white/10 hover:brightness-110 text-slate-800 dark:text-slate-200 active:scale-95 transition cursor-pointer shadow-sm"
                  onClick={() => navigate(`/messages/${user._id}`)}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  className="size-10 flex items-center justify-center text-sm rounded-xl bg-white/60 dark:bg-white/10 hover:brightness-110 text-slate-800 dark:text-slate-200 active:scale-95 transition cursor-pointer shadow-sm"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
