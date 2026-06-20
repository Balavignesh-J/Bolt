import { useState } from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import { X, Menu } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return user ? (
    <div className="w-full flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 max-w-full">
        {/* Navigation/Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between gap-4 h-16 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-2xl transition-all duration-300 mx-4 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 px-4 sm:px-6">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            {sidebarOpen ? (
              <X
                className="p-2 z-50 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-xl w-10 h-10 text-slate-600 dark:text-slate-300 transition-all duration-300 sm:hidden cursor-pointer hover:brightness-110"
                onClick={() => setSidebarOpen(false)}
              />
            ) : (
              <Menu
                className="p-2 z-50 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-xl w-10 h-10 text-slate-600 dark:text-slate-300 transition-all duration-300 sm:hidden cursor-pointer hover:brightness-110"
                onClick={() => setSidebarOpen(true)}
              />
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Loading height="100vh" />
  );
};

export default Layout;
