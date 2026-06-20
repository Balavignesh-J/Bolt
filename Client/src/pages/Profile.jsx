import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import moment from "moment";
import ProfileModal from "../components/ProfileModal";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ThemeToggle from "../components/ThemeToggle";

const Profile = () => {
  const currentUser = useSelector((state) => state.user.value);
  const { getToken } = useAuth();
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async (profileId) => {
    const token = await getToken();
    try {
      const { data } = await api.post(
        "/api/user/profiles",
        { profileId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        setUser(data.profile);
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchUser(profileId);
    } else {
      fetchUser(currentUser._id);
    }
  }, [profileId]);

  return user ? (
    <div className="relative h-full overflow-y-scroll p-6">
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>
      <div className="max-w-3xl mx-auto">
        {/* Profile card  */}
        <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-300">
          {/* Cover photo  */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>
        {/* Tabs  */}
        <div className="mt-6">
          <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl p-1 flex max-w-md mx-auto transition-all duration-300">
            {["posts", "media", "likes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer ${activeTab === tab ? "bg-white/70 dark:bg-white/15 shadow-sm text-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {/* posts  */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
          {/* media  */}
          {activeTab === "media" && (
            <div className="mt-6 flex flex-wrap max-w-6xl ">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <>
                    {post.image_urls.map((image, index) => (
                      <Link
                        target="_blank"
                        to={image}
                        key={index}
                        className="relative group"
                      >
                        <img
                          key={index}
                          src={image}
                          alt=""
                          className="w-64 aspect-video object-cover "
                        />
                        <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300 ">
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
      {showEdit && <ProfileModal setShowEdit={setShowEdit} />}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
