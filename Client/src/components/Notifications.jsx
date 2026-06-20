import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Notifications = ({ t, message }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`max-w-md w-full bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl flex hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-start ">
          <img
            src={message.from_user_id.profile_picture}
            alt=""
            className="h-10 w-10 rounded-full flex-shrink-0 mt-0.5"
          />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {message.from_user_id.full_name}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {message.text ? message.text.slice(0, 50) : "Sent a media file"}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-white/40 dark:border-white/10">
        <button
          onClick={() => {
            navigate(`/messages/${message.from_user_id._id}`);
            toast.dismiss(t.id);
          }}
          className="p-4 text-indigo-600 dark:text-indigo-400 hover:bg-white/50 dark:hover:bg-white/10 rounded-r-2xl transition-colors font-semibold cursor-pointer"
        >
          Reply
        </button>
      </div>
    </div>
  );
};

export default Notifications;
