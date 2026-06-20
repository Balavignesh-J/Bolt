import { Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { dummyStoriesData } from "../assets/assets";
import moment from "moment";
import StoryModal from "./StoryModal";
import StoryViewer from "./StoryViewer";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const StoriesBar = () => {
  const { getToken } = useAuth();
  const [stories, setstories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewStory, setViewStory] = useState(null);

  const fetchStories = async () => {
    const token = await getToken();
    try {
      const { data } = api.get("/api/story/get", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setstories(data.stories);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const scrollRef = useRef(null);

  const handleWheel = (e) => {
    if (scrollRef.current) {
      e.preventDefault();
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-auto px-4"
    >
      <div className="flex gap-4 pb-5">
        <div
          onClick={() => setShowModal(true)}
          className="rounded-lg shadow-sm min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white"
        >
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="size-10 bg-indigo-500 rounded-full flex items-center justify-center mb-3">
              <Plus />
            </div>
            <p>Create Story</p>
          </div>
        </div>
        {stories.map((story, idx) => {
          return (
            <div
              key={idx}
              onClick={() => setViewStory(story)}
              className="relative rounded-lg shadow min-w-30 max-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 bg-gradient-to-b from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 overflow-hidden"
            >
              <img
                src={story.user.profile_picture}
                alt="story owner profile"
                className="absolute size-8 top-3 left-3 z-10 rounded-full ring ring-gray-100 shadow"
              />
              <p className="absolute top-18 left-3 text-white/60 text-sm truncate max-w-24">
                {story.content}
              </p>
              <p className="text-white absolute bottom-1 right-2 z-10 text-xs">
                {moment(story.createdAt).fromNow()}
              </p>
              {story.media_type !== "text" && (
                <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                  {story.media_type === "image" ? (
                    <img
                      src={story.media_url}
                      alt=""
                      className="h-full w-full object-cover hover:scale-100 transition duration-500 opacity-70 hover:opacity-80"
                    />
                  ) : (
                    <video
                      src={story.media_url}
                      autoPlay
                      muted
                      className="h-full w-full object-cover hover:scale-100 transition duration-500 opacity-70 hover:opacity-80"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showModal && (
        <StoryModal setShowModal={setShowModal} fetchStories={fetchStories} />
      )}
      {viewStory && (
        <StoryViewer viewStory={viewStory} setViewStory={setViewStory} />
      )}
    </div>
  );
};

export default StoriesBar;
