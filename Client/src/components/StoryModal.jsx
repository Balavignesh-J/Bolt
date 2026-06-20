import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, Sparkle, Text, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgcolors = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ea8a04",
    "#bd9488",
  ];
  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgcolors[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { getToken } = useAuth();

  const MAX_VIDEO_DURATION = 60;
  const MAX_VIDEO_SIZE_MB = 50;

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
          toast.error(`Video size cannot exceed ${MAX_VIDEO_SIZE_MB}mb`);
          setMedia(null);
          setPreviewUrl(null);
          return;
        }

        const video = document.createElement("video");
        video.src = URL.createObjectURL(file);
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > MAX_VIDEO_DURATION) {
            toast.error(
              `Video duration cannot exceed ${MAX_VIDEO_DURATION} seconds`,
            );
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setMode("media");
            setText(" ");
          }
        };
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setMode("media");
        setText(" ");
      }
    }
  };

  const handleCreateStory = async (e) => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";
    if (media_type === "text" && !text) {
      return toast.error("Please enter some text");
    }
    const formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    formData.append("background_color", background);
    if (media) formData.append("media", media);
    const token = await getToken();
    try {
      const { data } = await api.post(`/api/story/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setShowModal(false);
        toast.success("Story created successfully");
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModal(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft />
          </button>
          <p className="text-lg font-semibold">Create Story</p>
          <span className="w-10"></span>
        </div>
        <div
          className="rounded-lg h-96 flex items-center justify-center relative"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="what's on your mind?"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
          )}
          {mode === "media" &&
            previewUrl &&
            (media.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt="selected story image"
                className="max-h-full object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                alt="selected story video"
                className="max-h-full object-contain"
              />
            ))}
        </div>
        <div className="flex gap-2 mt-4">
          {bgcolors.map((bgColor) => {
            return (
              <button
                key={bgColor}
                style={{ backgroundColor: bgColor }}
                className="w-6 h-6 rounded-full ring cursor-pointer"
                onClick={() => setBackground(bgColor)}
              />
            );
          })}
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <Text size={18} />
            Text
          </button>
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleMediaUpload}
              hidden
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>
        <button
          onClick={(e) =>
            toast.promise(handleCreateStory(e), {
              loading: "Creating story...",
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition"
        >
          <Sparkle size={18} />
          Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModal;
