import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Truck, 
  ClipboardList, 
  BarChart3, 
  Settings, 
  LogOut,
  UtensilsCrossed
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Bảng điều khiển", path: "/" },
  { icon: Users, label: "Người dùng", path: "/users" },
  { icon: Store, label: "Nhà hàng", path: "/restaurants" },
  { icon: Truck, label: "Tài xế", path: "/drivers" },
  { icon: ClipboardList, label: "Đơn hàng", path: "/orders", badge: 12 },
  { icon: BarChart3, label: "Báo cáo & Phân tích", path: "/analytics" },
  { icon: Settings, label: "Cài đặt", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-premium">
          <UtensilsCrossed size={24} />
        </div>
        <span className="text-xl font-bold tracking-tight text-brand-primary">
          CRAVE & CO.
        </span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-2">
          QUẢN LÝ CHÍNH
        </div>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-brand-primary text-white shadow-premium" 
                  : "text-slate-500 hover:bg-brand-bg hover:text-brand-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-brand-primary"} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white text-brand-primary" : "bg-red-500 text-white"}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-brand-bg rounded-2xl p-3 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="text-sm font-bold text-brand-text truncate">Admin Culinary</div>
            <div className="text-[10px] text-brand-text-muted truncate">admin@system.com</div>
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
          <LogOut size={20} />
          <span className="font-medium text-sm">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
