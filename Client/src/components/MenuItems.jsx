import { NavLink } from "react-router-dom";
import { menuItemsData } from "../assets/assets";

const MenuItems = ({ setSidebarOpen }) => {
  return (
    <div className="px-6 text-slate-300 space-y-1 font-medium">
      {menuItemsData.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `px-3.5 py-2 flex items-center gap-3 rounded-xl transition-colors ${isActive ? "bg-indigo-500/20 text-indigo-300" : "hover:bg-white/10 text-slate-300 hover:text-white"}`
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
