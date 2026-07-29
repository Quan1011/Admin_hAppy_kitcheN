import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import {
  Menu,
  X,
  Home,
  Settings,
  UtensilsCrossed,
  FolderTree,
  LogOut,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  // Danh sách các mục trên Sidebar
  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home className="w-5 h-5" /> },
    {
      name: "Thông tin chung",
      path: "/info",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      name: "Cấu trúc Danh mục",
      path: "/categories",
      icon: <FolderTree className="w-5 h-5" />,
    },
    {
      name: "Dị ứng & Phụ gia",
      path: "/allergens",
      icon: <ShieldAlert className="w-5 h-5" />,
    }, // Thêm ở đây
    {
      name: "Quản lý Menu",
      path: "/menu",
      icon: <UtensilsCrossed className="w-5 h-5" />,
    },
  ];

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Chuyển hướng người dùng về trang Login ngay sau khi hủy session
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error("Lỗi khi đăng xuất: " + error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <span className="font-bold text-gray-800 text-lg">Admin Dashboard</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* BACKDROP KHI MỞ MENU TRÊN MOBILE */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR BAR - MOBILE */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* LOGO */}
        <div className="h-16 p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-blue-600">
            Restaurant Admin
          </h2>
          {/* <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button> */}
        </div>

        {/* MENU LINK */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* NÚT ĐĂNG XUẤT */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>{loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
          </button>
        </div>
      </aside>

      {/* SIDEBAR BAR - DESKTOP */}
      <aside className="hidden md:flex fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex-col">
        {/* LOGO */}
        <div className="h-16 p-6 border-b border-gray-100 flex items-center">
          <h2 className="text-xl font-extrabold text-blue-600">
            Restaurant Admin
          </h2>
        </div>

        {/* MENU LINK */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* NÚT ĐĂNG XUẤT */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium text-sm transition-colors disabled:opacity-50"
          >
            {loggingOut ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogOut className="w-5 h-5" />
            )}
            <span>{loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
          </button>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH (PAGES) */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto pt-22 md:pt-5">
        <Outlet />
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </div>
  );
}
