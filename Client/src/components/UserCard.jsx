import { useAuth } from "@clerk/clerk-react";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { fetchUser } from "../features/user/userSlice";

const UserCard = ({ user }) => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFollow = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/follow",
        { id: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchUser(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleConnectionRequest = async () => {
    if (currentUser.connections.includes(user._id)) {
      return navigate(`/messages/${user._id}`);
    }
    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/user/connect",
        { id: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      key={user._id}
      className="p-4 pt-6 flex flex-col justify-between w-72 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300"
    >
      <div className="text-center">
        <img
          src={user.profile_picture}
          alt=""
          className="rounded-full w-16 shadow-md mx-auto"
        />
        <p className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</p>
        {user.username && (
          <p className="text-slate-500 dark:text-slate-400 font-light">@{user.username}</p>
        )}
        {user.bio && (
          <p className="text-slate-600 dark:text-slate-300 mt-2 text-center text-sm px-4">
            {user.bio}
          </p>
        )}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1 border border-white/40 dark:border-white/10 rounded-full px-3 py-1 bg-white/40 dark:bg-white/5 backdrop-blur-md">
            <MapPin className="w-4 h-4" />
            {user.location}
          </div>
          <div className="flex items-center gap-1 border border-white/40 dark:border-white/10 rounded-full px-3 py-1 bg-white/40 dark:bg-white/5 backdrop-blur-md">
            <span>{user.followers.length}</span> Followers
          </div>
        </div>
      </div>
      <div className="flex mt-4 gap-2">
        <button
          onClick={handleFollow}
          disabled={currentUser?.following.includes(user._id)}
          className="w-full py-2 rounded-xl flex justify-center items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <UserPlus className="w-4 h-4" />
          {currentUser?.following.includes(user._id) ? "Following" : "Follow"}
        </button>
        <button
          onClick={handleConnectionRequest}
          className="flex items-center justify-center w-16 border border-white/40 dark:border-white/10 text-slate-600 dark:text-slate-400 group rounded-xl cursor-pointer active:scale-95 transition bg-white/60 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 shadow-md backdrop-blur-xl"
        >
          {currentUser?.connections.includes(user._id) ? (
            <MessageCircle className="w-5 h-5 group-hover:scale-105 transition" />
          ) : (
            <Plus className="w-5 h-5 group-hover:scale-95 transition" />
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
