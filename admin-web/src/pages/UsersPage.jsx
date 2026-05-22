import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AdminLayout from "../layouts/AdminLayout";
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
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Eye
} from "lucide-react";
import { request } from "../api/client";
import toast from "react-hot-toast";
import DetailModal from "../components/DetailModal";

const roleMap = {
  user: 'KHÁCH HÀNG',
  merchant: 'ĐỐI TÁC QUÁN',
  shipper: 'TÀI XẾ',
  admin: 'QUẢN TRỊ'
};

const statusMap = {
  active: 'Hoạt động',
  banned: 'Bị chặn',
  pending: 'Chờ duyệt'
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      const data = await request("/auth/users");
      setUsers(data);
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const socket = io("http://localhost:5000");
    
    socket.on("new_user_registered", () => {
      fetchUsers();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "banned" ? "active" : "banned";
    try {
      await request(`/auth/users/${userId}/status`, {
        method: "PUT",
        body: { status: newStatus },
      });
      toast.success(newStatus === "banned" ? "Đã khóa người dùng thành công" : "Đã mở khóa người dùng thành công");
      fetchUsers();
    } catch (error) {
      toast.error("Thao tác thất bại: " + error.message);
    }
  };

  // Filter list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus = filterStatus === "all" || u.status === filterStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <AdminLayout title="Quản lý Người dùng">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Quản lý Người dùng</h2>
            <p className="text-sm text-slate-400">Quản lý tất cả tài khoản khách hàng, đối tác nhà hàng và tài xế trong hệ thống.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "TỔNG NGƯỜI DÙNG", value: totalUsers, icon: UsersIcon, color: "text-orange-600 bg-orange-100" },
            { label: "ĐANG HOẠT ĐỘNG", value: activeUsers, icon: UserCheck, color: "text-green-600 bg-green-100" },
            { label: "TÀI KHOẢN BỊ CHẶN", value: bannedUsers, icon: UserX, color: "text-red-600 bg-red-100" },
            { label: "CHỜ DUYỆT", value: pendingUsers, icon: UserPlus, color: "text-blue-600 bg-blue-100" },
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl text-sm transition-all"
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-brand-bg border-transparent rounded-xl text-xs font-bold text-slate-500 focus:ring-0 px-4 py-3 cursor-pointer"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="user">Khách hàng</option>
                <option value="shipper">Tài xế</option>
                <option value="merchant">Đối tác</option>
                <option value="admin">Quản trị</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-brand-bg border-transparent rounded-xl text-xs font-bold text-slate-500 focus:ring-0 px-4 py-3 cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="banned">Bị chặn</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400 text-sm font-medium">Đang tải dữ liệu người dùng...</div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-brand-bg/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">NGƯỜI DÙNG</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">VAI TRÒ</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">TRẠNG THÁI</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-brand-bg/20 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.fullName}`} 
                            alt={user.fullName} 
                            className="w-10 h-10 rounded-full object-cover shadow-sm" 
                          />
                          <div>
                            <div className="text-sm font-bold text-brand-text">{user.fullName}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{user.email} • {user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter ${
                          user.role === 'user' ? 'bg-orange-50 text-orange-600' :
                          user.role === 'shipper' ? 'bg-blue-50 text-blue-600' : 
                          user.role === 'merchant' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                          {roleMap[user.role] || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                          <span className={`text-xs font-bold ${user.status === 'active' ? 'text-green-600' : user.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                            {statusMap[user.status] || user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {user.role !== 'admin' && (
                            <button 
                              onClick={() => handleToggleStatus(user._id, user.status)}
                              className={`p-2 rounded-lg transition-all ${
                                user.status === "banned" 
                                  ? "text-green-500 hover:bg-green-50" 
                                  : "text-red-500 hover:bg-red-50"
                              }`}
                              title={user.status === "banned" ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                            >
                              {user.status === "banned" ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-white">
              <div className="text-xs text-slate-500 font-medium">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} đến {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trong số {filteredUsers.length}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="text-sm font-bold text-brand-text px-2">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <DetailModal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} data={selectedUser} type="user" />
    </AdminLayout>
  );
};

export default UsersPage;
