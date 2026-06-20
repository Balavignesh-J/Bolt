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
      <div className="max-xl:hidden sticky top-10">
        <div className="max-w-xs bg-white/10 backdrop-blur-md border border-white/20 text-xs p-4 rounded-xl flex flex-col gap-2 shadow-lg text-slate-200">
          <h3 className="text-slate-100 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt="Sponsored"
            className="w-full h-auto rounded-md object-cover"
          />
          <p className="text-slate-200 font-medium">Email Marketing</p>
          <p className="text-slate-400 text-sm">
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
