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
      className={`w-60 xl:w-72 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col justify-between items-center max-sm:absolute top-0 bottom-0 z-20 ${sidebarOpen ? "translate-x-0" : "max-sm:-translate-x-full"} transition-all duration-300 ease-in-out`}
    >
      <div className="w-full">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt=""
          className="w-26 ml-7 my-2 cursor-pointer"
        />
        <hr className="border-white/10 mb-8" />
        <MenuItems setSidebarOpen={setSidebarOpen} />
        <Link
          to="/create-post"
          className="flex items-center justify-center gap-2 py-2.5 mt-6 mx-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer"
        >
          <CirclePlus className="w-5 h-5" />
          Create Post
        </Link>
      </div>
      <div className="w-full border-t border-white/10 p-4 px-7 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h1 className="text-sm font-medium">{user.full_name}</h1>
            <p className="text-xs text-slate-400">@{user.username}</p>
          </div>
        </div>
        <LogOut
          onClick={signOut}
          className="w-4.5 text-slate-400 hover:text-white transition cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
