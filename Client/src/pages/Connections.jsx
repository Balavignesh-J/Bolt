import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  UserCheck,
  UserPlus,
  UserRoundPen,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const { connections, pendingConnections, following, followers } = useSelector(
    (state) => state.connections,
  );
  const dataArray = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Following", value: following, icon: UserCheck },
    { label: "Pending", value: pendingConnections, icon: UserRoundPen },
    { label: "Connections", value: connections, icon: UserPlus },
  ];
  const handleUnfollow = async (userId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/user/unfollow`,
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const acceptConnection = async (userId) => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/user/accept`,
        { id: userId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        dispatch(fetchConnections(token));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchConnections(token));
    });
  }, []);
  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title  */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Connections
          </h1>
          <p className="text-slate-300">
            Manage your network and discover new connections
          </p>
        </div>
        {/* counts  */}
        <div className="mb-8 flex flex-wrap gap-6">
          {dataArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-1 border h-20 w-40 border-white/20 bg-white/10 backdrop-blur-md shadow-lg rounded-xl text-slate-200"
            >
              <b>{item.value.length}</b>
              <p className="text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
        {/* Tabs  */}

        <div className="inline-flex flex-wrap items-center border border-white/20 rounded-xl p-1 bg-white/10 backdrop-blur-md shadow-md text-slate-200">
          {dataArray.map((tab) => (
            <button
              onClick={() => setCurrentTab(tab.label)}
              key={tab.label}
              className={`flex items-center px-3 py-1 cursor-pointer text-sm rounded-md transition-colors ${currentTab === tab.label ? "bg-white/20 font-medium text-white shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="ml-1">{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-2 text-xs bg-white/20 text-slate-200 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* connections  */}
        <div className="flex flex-wrap gap-6 mt-6">
          {dataArray
            .find((item) => item.label === currentTab)
            ?.value.map((user) => (
              <div
                key={user._id}
                className="w-full max-w-88 flex gap-5 p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl"
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="rounded-full w-12 h-12 shadow-md mx-auto"
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-200">{user.full_name}</p>
                  <p className="text-slate-400">@{user.username}</p>
                  <p className="text-sm text-slate-300">
                    {user.bio.slice(0, 30)}...
                  </p>
                  <div className="flex max-sm:flex-col gap-2 mt-4">
                    {
                      <button
                        onClick={() => navigate(`/profile/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
                      >
                        View Profile
                      </button>
                    }
                    {currentTab === "Following" && (
                      <button
                        onClick={() => handleUnfollow(user._id)}
                        className="w-full p-2 text-sm rounded bg-white/10 hover:bg-white/20 text-slate-200 active:scale-95 transition cursor-pointer"
                      >
                        Unfollow
                      </button>
                    )}
                    {currentTab === "Pending" && (
                      <button
                        onClick={() => acceptConnection(user._id)}
                        className="w-full p-2 text-sm rounded bg-white/10 hover:bg-white/20 text-slate-200 active:scale-95 transition cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {currentTab === "Connections" && (
                      <button
                        onClick={() => navigate(`/messages/${user._id}`)}
                        className="w-full p-2 text-sm rounded bg-white/10 hover:bg-white/20 text-slate-200 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Message
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Connections;
