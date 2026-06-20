import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import api from "../api/axios.js";

const Feed = () => {
  const [feeds, setfeeds] = useState([]);
  const [loading, setloading] = useState(true);
  const { getToken } = useAuth();

  const fetchFeeds = async () => {
    try {
      const token = await getToken();
      setloading(true);

      const { data } = await api.get("/api/post/feed", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setfeeds(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
      <div className="max-xl:hidden sticky top-10 space-y-6">
        <div className="max-w-xs bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl p-6 text-xs flex flex-col gap-3 transition-all duration-300">
          <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt="Sponsored"
            className="w-full h-auto rounded-xl object-cover"
          />
          <p className="text-slate-600 dark:text-slate-300 font-medium text-sm">Email Marketing</p>
          <p className="text-slate-400 dark:text-slate-500">
            Supercharge your marketing with a powerful, easy-to-use platform
            built for results.
          </p>
        </div>
        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading height={"50vh"} />
  );
};

export default Feed;
