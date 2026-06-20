import { useState } from "react";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user.value);
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    if (!images.length && !content) {
      return toast.error("Please Add one text or image");
    }
    setLoading(true);
    const postType =
      images.length && content
        ? "text_with_image"
        : images.length
          ? "image"
          : "text";

    try {
      const formData = new FormData();

      formData.append("content", content);
      formData.append("post_type", postType);
      images.map((image) => {
        formData.append("images", image);
      });
      const token = await getToken();
      const { data } = await api.post("/api/post/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        navigate("/");
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      <div className="max-w-6xl mx-auto p-6">
        {/* title  */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Create Post
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Share your thoughts with the world.</p>
        </div>
        {/* Form */}
        <div className="max-w-xl bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl p-4 sm:p-8 sm:pb-4 space-y-4 transition-all duration-300">
          {/* Header  */}
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture}
              alt=""
              className="w-12 h-12 rounded-full shadow"
            />
            <div className="">
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{user.full_name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
            </div>
          </div>
          {/* textare  */}
          <textarea
            className="w-full resize-none min-h-24 mt-4 text-sm outline-none bg-transparent placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
            placeholder="What's happening?"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          ></textarea>
          {/* Images  */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, i) => (
                <div key={i} className="relative group">
                  <img
                    key={i}
                    src={URL.createObjectURL(image)}
                    alt=""
                    className="h-20 rounded-md"
                  />
                  <div
                    onClick={() =>
                      setImages(images.filter((_, index) => index !== i))
                    }
                    className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* bottom bar  */}
          <div className="flex items-center justify-between pt-4 border-t border-white/40 dark:border-white/10 mt-2">
            <label
              htmlFor="images"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <Image className="size-6" />
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => setImages([...images, ...e.target.files])}
            />
            <button
              disabled={loading}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "uploading ...",
                  success: <p>Post Added</p>,
                  error: <p>Post Not Added</p>,
                })
              }
              type="submit"
              className="px-8 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 text-sm"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
