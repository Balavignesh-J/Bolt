import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import MenuItems from "./MenuItems";
import { CirclePlus, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { UserButton, useClerk } from "@clerk/clerk-react";
import { useSelector } from "react-redux";

const SideBar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);
  const { signOut } = useClerk();
  return (
    <div
      className={`w-60 xl:w-72 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl p-4 space-y-2 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out sm:my-6 sm:ml-6 sm:h-[calc(100vh-3rem)] h-full`}
    >
      <div className="w-full">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="w-26 ml-7 my-2 cursor-pointer"
        />
        <hr className="border-white/20 dark:border-white/10 mb-8" />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-white/20 dark:border-white/10 p-4 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.full_name}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
