import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes_count);
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const handleLike = async () => {
    try {
      const token = await getToken();
      const { data } = await api.post(
        `/api/post/like`,
        { postId: post._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        setLikes((prev) =>
          prev.includes(currentUser._id)
            ? prev.filter((id) => id !== currentUser._id)
            : [...prev, currentUser._id],
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleShare = () => {};
  const toggleComments = () => {};
  const postwithHashtags = post.content.replace(
    /(#\w+)/g,
    `<span class="text-indigo-600">$1</span>`,
  );
  return (
    <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300 p-4 sm:p-6 space-y-4 w-full max-w-2xl text-slate-900 dark:text-slate-100">
      {/* user info + menu */}
      <div className="inline-flex items-center gap-3 cursor-pointer">
        <img
          src={post.user.profile_picture}
          alt=""
          className="w-10 h-10 rounded-full shadow"
        />
        <div>
          <div className="flex items-center space-x-1">
            <span className="font-medium">{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-sm">
            @{post.user.username} · {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>
      {post.content && (
        <div
          className="text-slate-600 dark:text-slate-300 text-sm"
          dangerouslySetInnerHTML={{ __html: postwithHashtags }}
        ></div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((url, index) => (
          <img
            src={url}
            key={index}
            alt=""
            className={`w-full h-48 object-cover rounded-lg ${post.image_urls.length === 1 && "col-span-2 h-auto"}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-sm pt-4 border-t border-white/20 dark:border-white/10">
        <div className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 cursor-pointer transition-colors" onClick={handleLike}>
          <Heart
            className={`w-4 h-4 ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500"
            }`}
          />
          <span>{likes.length}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 cursor-pointer transition-colors" onClick={toggleComments}>
          <MessageCircle className="w-4 h-4" />
          <span>{12}</span>
        </div>
        <div className="flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 cursor-pointer transition-colors" onClick={handleShare}>
          <Share2 className="w-4 h-4" />
          <span>{7}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
