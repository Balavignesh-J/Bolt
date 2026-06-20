import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import api from "../api/axios";
import { useAuth } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

import toast from "react-hot-toast";

const Discover = () => {
  const [input, setInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();
  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      setUsers([]);
      setLoading(true);
      try {
        const token = await getToken();
        const { data } = await api.post(
          "/api/user/discover",
          { input },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (data.success) {
          setUsers(data.users);
        } else {
          toast.error(data.message);
        }
        setLoading(false);
        setInput("");
      } catch (error) {
        toast.error(error.message);
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token));
    });
  }, []);

  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title  */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Connect with amazing people and grow your network
          </p>
        </div>
        {/* Search  */}
        <div className="mb-8 shadow-xl shadow-slate-200/50 dark:shadow-black/30 rounded-2xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl transition-all duration-300">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search people by name, username, bio or location..."
                className="pl-10 sm:pl-12 py-2.5 w-full border border-gray-300 dark:border-white/10 rounded-xl max-sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all duration-200"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyUp={handleSearch}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          {users.map((user) => (
            <UserCard user={user} key={user._id} />
          ))}
        </div>
        {loading && <Loading height="60vh" />}
      </div>
    </div>
  );
};

export default Discover;
