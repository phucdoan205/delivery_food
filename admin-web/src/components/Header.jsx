import React, { useState, useEffect } from "react";
import { Search, Bell, HelpCircle, Menu } from "lucide-react";
import { io } from "socket.io-client";
import { request } from "../api/client";

const Header = ({ title, onMenuClick }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [limit, setLimit] = useState(5);

  const fetchNotifications = async (currentLimit = 5) => {
    try {
      const data = await request(`/notifications?admin=true&limit=${currentLimit}`);
      setNotifications(data);
      const unreadData = await request("/notifications/unread?admin=true");
      setUnreadCount(unreadData.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications(limit);
    
    const socket = io("http://localhost:5000");
    socket.emit("join", "admin");

    socket.on("new_notification", (notif) => {
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => socket.disconnect();
  }, [limit]);

  const handleOpenDropdown = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      try {
        await request("/notifications/read-all?admin=true", { method: "PUT" });
        setUnreadCount(0);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <header className="h-16 bg-brand-surface/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-2 lg:gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-brand-text-muted hover:bg-brand-bg rounded-lg transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-brand-text truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-brand-text-muted group-focus-within:text-brand-primary">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh..." 
            className="pl-10 pr-12 py-2 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-full text-sm w-64 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <button 
            className="p-2 text-brand-text-muted hover:bg-brand-bg hover:text-brand-primary rounded-full transition-colors relative"
            onClick={handleOpenDropdown}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showDropdown && (
            <div className="absolute top-12 right-0 w-80 bg-brand-surface rounded-2xl shadow-premium border border-brand-border overflow-hidden z-50">
              <div className="p-4 border-b border-brand-border bg-brand-bg flex justify-between items-center">
                <h3 className="font-bold text-brand-text">Thông báo</h3>
                <span className="text-xs text-brand-primary cursor-pointer hover:underline" onClick={() => setLimit(5)}>Mới nhất</span>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-brand-text-muted text-sm">Chưa có thông báo nào.</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif._id} className={`p-4 border-b border-brand-border hover:bg-brand-bg cursor-pointer ${!notif.isRead ? 'bg-orange-50/10' : ''}`}>
                      <div className="font-bold text-sm text-brand-text">{notif.title}</div>
                      <div className="text-xs text-brand-text-muted mt-1">{notif.message}</div>
                      <div className="text-[10px] text-brand-text-muted mt-2">
                        {new Date(notif.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {notifications.length >= limit && (
                <button 
                  onClick={() => setLimit(prev => prev + 3)}
                  className="w-full p-3 text-sm font-bold text-brand-primary hover:bg-brand-bg transition-colors text-center"
                >
                  Đọc tiếp
                </button>
              )}
            </div>
          )}

          <button className="p-2 text-brand-text-muted hover:bg-brand-bg hover:text-brand-primary rounded-full transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
