import { useState } from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";

const Layout = () => {
  const user = useSelector((state) => state.user.value);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return user ? (
    <div className="w-full flex h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm sm:hidden cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 max-w-full relative">
        {/* Floating Mobile Menu Button */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="sm:hidden absolute top-4 left-4 z-40 p-2 bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/30 backdrop-blur-xl rounded-xl text-slate-600 dark:text-slate-300 transition-all duration-300 hover:brightness-110 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

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
