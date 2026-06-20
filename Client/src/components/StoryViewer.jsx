import { BadgeCheck, X } from "lucide-react";
import { useEffect, useState } from "react";

const StoryViewer = ({ viewStory, setViewStory }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (viewStory.media_type !== "video") {
      const time = setInterval(() => {
        setProgress((prev) => prev + 1);
      }, 100);

      return () => clearInterval(time);
    }
  }, [viewStory, setViewStory]);

  useEffect(() => {
    if (progress >= 100) {
      setViewStory(null);
    }
  }, [progress, setViewStory]);

  const handleClose = () => {
    setViewStory(null);
  };

  const renderContent = () => {
    switch (viewStory.media_type) {
      case "image":
        return (
          <img
            src={viewStory.media_url}
            alt=""
            className="max-w-full max-h-screen object-contain"
          />
        );
        break;
      case "video":
        return (
          <video
            src={viewStory.media_url}
            className="max-h-screen"
            autoPlay
            onEnded={handleClose}
            onTimeUpdate={(e) => {
              const { currentTime, duration } = e.target;
              setProgress((currentTime / duration) * 100);
            }}
          />
        );
        break;
      case "text":
        return (
          <div className="w-full h-full flex items-center justify-center p-8 text-white text-2xl text-center">
            {viewStory.content}
          </div>
        );
        break;

      default:
        return null;
        break;
    }
  };
  return (
    <div
      className="fixed inset-0 h-screen bg-slate-900/30 dark:bg-black/50 backdrop-blur-sm z-110 flex items-center justify-center"
      style={{
        backgroundColor:
          viewStory.media_type === "text"
            ? viewStory.background_color
            : "#000000",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700">
        <div
          className="h-full bg-white transition-all duration-100 linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="absolute top-4 left-4 flex items-center space-x-3 p-2 px-4 sm:p-4 sm:px-8 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300">
        <img
          src={viewStory.user?.profile_picture}
          alt=""
          className="size-7 sm:size-8 rounded-full object-cover border border-white"
        />
        <div className="text-white font-medium flex items-center gap-1.5">
          <span>{viewStory.user?.full_name}</span>
          <BadgeCheck size={18} />
        </div>
      </div>
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white text-3xl font-bold focus:outline-none"
      >
        <X className="w-8 h-8 hover:scale-110 transition cursor-pointer" />
      </button>

      <div>{renderContent()}</div>
    </div>
  );
};

export default StoryViewer;
