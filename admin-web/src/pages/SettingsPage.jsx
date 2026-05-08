import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Settings, User, Bell, Shield, Globe, CreditCard } from "lucide-react";

const SettingsPage = () => {
  return (
    <AdminLayout title="Cài đặt hệ thống">
      <div className="max-w-4xl space-y-8">
        <div>
          <h2 className="text-2xl font-black text-brand-text">Cài đặt</h2>
          <p className="text-sm text-slate-400">Quản lý cấu hình hệ thống và tài khoản cá nhân.</p>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-8 border-r border-slate-50 space-y-2">
              {[
                { icon: User, label: "Tài khoản", active: true },
                { icon: Bell, label: "Thông báo" },
                { icon: Shield, label: "Bảo mật" },
                { icon: Globe, label: "Ngôn ngữ" },
                { icon: CreditCard, label: "Thanh toán" },
              ].map((item) => (
                <button 
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                    item.active ? "bg-brand-primary text-white shadow-premium" : "text-slate-500 hover:bg-brand-bg hover:text-brand-primary"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="md:col-span-2 p-10 space-y-8">
              <div className="flex items-center gap-6">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Avatar" className="w-24 h-24 rounded-[32px] object-cover shadow-md" />
                <div>
                  <button className="px-6 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold mb-2">Thay đổi ảnh</button>
                  <p className="text-[10px] text-slate-400 font-medium">PNG, JPG tối đa 5MB. Khuyên dùng 400x400px.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Họ và tên</label>
                  <input type="text" defaultValue="Admin Culinary" className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" defaultValue="admin@system.com" className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Số điện thoại</label>
                  <input type="text" defaultValue="+84 901 234 567" className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Vai trò</label>
                  <input type="text" defaultValue="Super Admin" readOnly className="w-full px-4 py-3 bg-slate-50 border-transparent rounded-2xl text-sm font-medium text-slate-400 cursor-not-allowed" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
                <button className="px-6 py-3 bg-brand-bg text-brand-primary rounded-2xl text-sm font-bold">Hủy bỏ</button>
                <button className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-premium">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
