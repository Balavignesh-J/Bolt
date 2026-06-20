import { ArrowLeft, Sparkle, Text, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMode("media");
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateStory = async (e) => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";
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
              onChange={(e) => handleMediaUpload(e)}
              hidden
            />
            <Upload size={18} /> Photo/Video
          </label>
        </div>
        <button
          onClick={(e) =>
            toast.promise(handleCreateStory(e), {
              loading: "Creating story...",
              success: "Story created successfully!",
              error: (err) => <p>{err.message}</p>,
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
