import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Truck, LogOut, Map, Clipboard } from "lucide-react";
import clsx from "clsx";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  // Hardcoded Nav Items for now
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Live Map", path: "/map", icon: Map },
    { name: "Fleet", path: "/fleet", icon: Truck },
    { name: "Safety Logs", path: "/logs", icon: Clipboard }, // Replace `href` with `path`
  ];

  return (
    <div className="flex h-screen bg-brand-dark text-white">
      {/* SIDEBAR */}
      <aside className="w-64 bg-brand-surface border-r border-slate-700 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-700">
          <span className="text-xl font-bold text-brand-primary tracking-wide">
            AegisDrive
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path} // Always use `path`, guaranteed to be a string
              className={({ isActive }) =>
                clsx(
                  "flex items-center px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
            >
              <item.icon size={20} className="mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors">
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
