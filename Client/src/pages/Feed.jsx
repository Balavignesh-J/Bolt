import { assets, dummyPostsData } from "../assets/assets";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feeds, setfeeds] = useState([]);
  const [loading, setloading] = useState(true);

  const fetchfeeds = async () => {
    setfeeds(dummyPostsData);
    setloading(false);
  };

  useEffect(() => {
    fetchfeeds();
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
        <div className="max-w-xs bg-white text-xs p-4 rounded-md flex flex-col gap-2 shadow">
          <h3 className="text-slate-800 font-semibold">Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt="Sponsored"
            className="w-full h-auto rounded-md object-cover"
          />
          <p className="text-slate-600 font-medium">Email Marketing</p>
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
