import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  LogOut,
  User,
  X,
} from "lucide-react";

const Sidebar = ({ isMobileOpen, onClose }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Classes & Teachers", path: "/admin/classes", icon: GraduationCap },
    { name: "Learner Directory", path: "/admin/students", icon: Users },
    {
      name: "Attendance Reports",
      path: "/admin/attendance",
      icon: ClipboardCheck,
    },
    { name: "User Management", path: "/admin/users", icon: Users },
  ];

  const teacherLinks = [
    {
      name: "My Class Dashboard",
      path: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Take Attendance",
      path: "/teacher/attendance",
      icon: ClipboardCheck,
    },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : teacherLinks;
  const displayName =
    user?.name || (user?.role === "ADMIN" ? "School Admin" : "Teacher");
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <>
      {isMobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-[#4A2E2B] text-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#5C3A36] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316] font-bold text-white shadow">
              R
            </div>
            <div>
              <h1 className="font-bold tracking-wide text-stone-100">
                Rumbidzai ECD
              </h1>
              <p className="text-xs text-amber-200/70">Management Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-amber-100/80 hover:bg-[#5C3A36] lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#F97316] text-white shadow-md"
                      : "text-amber-100/80 hover:bg-[#5C3A36] hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-[#5C3A36] p-4 space-y-3">
          <div className="flex items-center gap-3 rounded-xl bg-[#361F1D] p-3 border border-[#5C3A36]/60 shadow-inner">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F97316] text-sm font-bold text-white shadow-sm">
              {userInitial || <User className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-100 truncate">
                {displayName}
              </p>
              {user?.email && (
                <p className="text-xs text-amber-200/60 truncate">
                  {user.email}
                </p>
              )}
              <span className="mt-1 inline-block rounded bg-[#F97316]/20 px-2 py-0.5 text-[10px] font-semibold text-[#F97316] uppercase tracking-wider">
                {user?.role || "USER"}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#5C3A36] bg-[#361F1D]/40 px-4 py-2.5 text-sm font-medium text-amber-100 hover:bg-rose-950/60 hover:text-rose-200 hover:border-rose-900/50 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
