import { useState } from "react";
import { Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../features/user/userSlice.js";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const ProfileModal = ({ setShowEdit }) => {
  const { getToken } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const [editForm, setEditForm] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    full_name: user.full_name,
    profile_picture: null,
    cover_photo: null,
  });
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      const {
        username,
        bio,
        location,
        full_name,
        profile_picture,
        cover_photo,
      } = editForm;
      userData.append("username", username);
      userData.append("bio", bio);
      userData.append("location", location);
      userData.append("full_name", full_name);
      profile_picture && userData.append("profile", profile_picture);
      cover_photo && userData.append("cover", cover_photo);

      const token = await getToken();
      dispatch(updateUser({ userData, token }));
      setShowEdit(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="fixed inset-0 z-110 h-screen overflow-y-scroll bg-slate-900/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300 p-6 text-slate-900 dark:text-slate-100">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Edit Profile
          </h1>
          <form
            className="space-y-4"
            onSubmit={(e) =>
              toast.promise(handleSaveProfile(e), { loading: "Saving..." })
            }
          >
            {/* profile Picture  */}
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
                <input
                  type="file"
                  id="profile_picture"
                  accept="image/*"
                  hidden
                  className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 text-slate-900 dark:text-slate-100"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
                <div className="group/profile relative">
                  <img
                    src={
                      editForm.profile_picture
                        ? URL.createObjectURL(editForm.profile_picture)
                        : user.profile_picture
                    }
                    alt=""
                    className="w-24 h-24 rounded-full object-cover mt-2"
                  />
                  <div className="absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-full items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>
            {/* cover photo  */}
            <div className="flex flex-col items-start gap-3">
              <label htmlFor="cover_photo" className="">
                Cover Photo
                <input
                  type="file"
                  id="cover_photo"
                  accept="image/*"
                  hidden
                  className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 text-slate-900 dark:text-slate-100"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm, // keep all other fields the same
                      cover_photo: e.target.files[0], // update only this
                      // Single upload → e.target.files[0]
                      // Multi-upload → ...e.target.files
                    })
                  }
                />
                <div className="group/cover relative">
                  <img
                    src={
                      editForm.cover_photo
                        ? URL.createObjectURL(editForm.cover_photo)
                        : user.cover_photo
                    }
                    alt=""
                    className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 
            via-purple-200 to-pink-200 object-cover mt-2"
                  />
                  <div className="absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>
            <div className="">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                placeholder="Please enter your full name"
                className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                value={editForm.full_name}
              />
            </div>
            <div className="">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
                placeholder="Please enter your username"
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                value={editForm.username}
              />
            </div>
            <div className="">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
                placeholder="Please enter a short bio"
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                value={editForm.bio}
              />
            </div>

            <div className="">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1"
              >
                Location
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100"
                placeholder="Please enter your location"
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                value={editForm.location}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-6">
              <button
                onClick={() => setShowEdit(false)}
                type="button"
                className="px-4 py-2 border border-white/40 dark:border-white/10 rounded-xl bg-white/60 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-xl text-slate-700 dark:text-slate-300 transition-colors cursor-pointer shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-medium shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default ProfileModal;
