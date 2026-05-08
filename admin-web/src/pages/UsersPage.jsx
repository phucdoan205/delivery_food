import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { USERS_DATA } from "../utils/mockData";
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  MoreHorizontal, 
  Users as UsersIcon,
  UserCheck,
  UserX,
  UserPlus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const UsersPage = () => {
  return (
    <AdminLayout title="Quản lý Người dùng">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Quản lý Người dùng</h2>
            <p className="text-sm text-slate-400">Quản lý tất cả tài khoản khách hàng, đối tác nhà hàng và tài xế trong hệ thống.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-brand-bg hover:text-brand-primary transition-all">
              <Download size={16} />
              Xuất Excel
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus size={16} />
              Thêm người dùng mới
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "TỔNG NGƯỜI DÙNG", value: "12,482", icon: UsersIcon, color: "text-orange-600 bg-orange-100" },
            { label: "ĐANG HOẠT ĐỘNG", value: "11,902", icon: UserCheck, color: "text-green-600 bg-green-100" },
            { label: "TÀI KHOẢN BỊ CHẶN", value: "580", icon: UserX, color: "text-red-600 bg-red-100" },
            { label: "CHỜ DUYỆT", value: "45", icon: UserPlus, color: "text-blue-600 bg-blue-100" },
          ].map((item) => (
            <div key={item.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${item.color}`}>
                <item.icon size={24} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                <div className="text-xl font-black text-brand-text">{item.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Table */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tên, email, SĐT..." 
                className="w-full pl-12 pr-4 py-3 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select className="bg-brand-bg border-transparent rounded-xl text-xs font-bold text-slate-500 focus:ring-0 px-4 py-3 cursor-pointer">
                <option>Tất cả vai trò</option>
                <option>Khách hàng</option>
                <option>Tài xế</option>
                <option>Đối tác</option>
              </select>
              <select className="bg-brand-bg border-transparent rounded-xl text-xs font-bold text-slate-500 focus:ring-0 px-4 py-3 cursor-pointer">
                <option>Tất cả trạng thái</option>
                <option>Hoạt động</option>
                <option>Bị chặn</option>
                <option>Chờ duyệt</option>
              </select>
              <button className="p-3 bg-brand-bg text-slate-500 rounded-xl hover:text-brand-primary transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-bg/50">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <input type="checkbox" className="rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20" />
                  </th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">NGƯỜI DÙNG</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">VAI TRÒ</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">TRẠNG THÁI</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">NGÀY THAM GIA</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {USERS_DATA.map((user) => (
                  <tr key={user.id} className="hover:bg-brand-bg/20 transition-colors group">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                        <div>
                          <div className="text-sm font-bold text-brand-text">{user.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                        user.role === 'KHÁCH HÀNG' ? 'bg-orange-50 text-orange-600' :
                        user.role === 'TÀI XẾ' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Hoạt động' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-bold ${user.status === 'Hoạt động' ? 'text-green-600' : 'text-red-600'}`}>
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500">{user.joinedDate}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-400 font-medium">Hiển thị <span className="font-bold text-brand-text">1-10</span> trong số <span className="font-bold text-brand-text">12,482</span> người dùng</p>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-brand-primary disabled:opacity-50" disabled><ChevronLeft size={20} /></button>
              {[1, 2, 3, "...", 1249].map((p, i) => (
                <button 
                  key={i} 
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    p === 1 ? "bg-brand-primary text-white shadow-premium" : "text-slate-500 hover:bg-brand-bg hover:text-brand-primary"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="p-2 text-slate-400 hover:text-brand-primary"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UsersPage;
