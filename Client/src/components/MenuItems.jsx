import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-2 text-slate-700 dark:text-slate-200 space-y-1 font-medium">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `px-3 py-2 flex items-center gap-3 rounded-xl font-medium transition-all duration-200 ${isActive ? "bg-white/70 dark:bg-white/15" : "hover:bg-white/50 dark:hover:bg-white/10"}`
          }
          onClick={() => setSidebarOpen(false)}
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
