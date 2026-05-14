import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { PENDING_DRIVERS, APPROVED_DRIVERS } from "../utils/mockData";
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Phone,
  Mail,
  FileText,
  TrendingUp,
  Clock,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  BadgeCheck,
  AlertCircle,
  Download,
  Plus,
  Truck
} from "lucide-react";

const DriversPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // default = pending
  const [pendingList, setPendingList] = useState(PENDING_DRIVERS);
  const [approvedList, setApprovedList] = useState(APPROVED_DRIVERS);
  const [searchPending, setSearchPending] = useState("");
  const [searchApproved, setSearchApproved] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = (driver) => {
    setPendingList((prev) => prev.filter((d) => d.id !== driver.id));
    setApprovedList((prev) => [
      {
        id: driver.id,
        name: driver.name,
        avatar: driver.avatar,
        phone: driver.phone,
        status: "Đang hoạt động",
        rating: 5.0, // Default rating for new drivers
        orders: 0,
        bike: driver.bike,
      },
      ...prev,
    ]);
    showToast(`✅ Đã phê duyệt tài xế "${driver.name}" thành công!`, "success");
    setActiveTab("info"); // Switch to info tab
  };

  const handleReject = (driver) => {
    setPendingList((prev) => prev.filter((d) => d.id !== driver.id));
    showToast(`❌ Đã từ chối tài xế "${driver.name}".`, "error");
  };

  const filteredPending = pendingList.filter(
    (d) =>
      d.name.toLowerCase().includes(searchPending.toLowerCase()) ||
      d.phone.includes(searchPending)
  );

  const filteredApproved = approvedList.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(searchApproved.toLowerCase()) ||
      d.phone.includes(searchApproved);
    const matchFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && d.status === "Đang hoạt động") ||
      (filterStatus === "offline" && d.status === "Ngoại tuyến") ||
      (filterStatus === "blocked" && d.status === "Đã khóa");
    return matchSearch && matchFilter;
  });

  const tabs = [
    { id: "pending", label: "Phê duyệt tài xế", count: pendingList.length },
    { id: "info", label: "Thông tin tài xế", count: approvedList.length },
  ];

  return (
    <AdminLayout title="Quản lý Tài xế">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-sm font-bold text-white transition-all animate-in slide-in-from-right duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">
              Quản lý Tài xế
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Phê duyệt đối tác mới và quản lý đội ngũ giao hàng của bạn.
            </p>
          </div>
          {activeTab === "info" && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-brand-bg hover:text-brand-primary transition-all">
                <Download size={16} />
                Xuất dữ liệu
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Plus size={16} />
                Thêm tài xế
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "CHỜ PHÊ DUYỆT",
              value: pendingList.length,
              icon: Clock,
              color: "text-amber-600 bg-amber-100",
            },
            {
              label: "ĐANG HOẠT ĐỘNG",
              value: approvedList.filter((d) => d.status === "Đang hoạt động")
                .length,
              icon: CheckCircle,
              color: "text-green-600 bg-green-100",
            },
            {
              label: "NGOẠI TUYẾN",
              value: approvedList.filter((d) => d.status === "Ngoại tuyến").length,
              icon: AlertCircle,
              color: "text-slate-600 bg-slate-100",
            },
            {
              label: "TỔNG ĐỐI TÁC",
              value: approvedList.length,
              icon: Truck,
              color: "text-brand-primary bg-orange-100",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
            >
              <div className={`p-3 rounded-2xl ${item.color}`}>
                <item.icon size={22} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {item.label}
                </div>
                <div className="text-2xl font-black text-brand-text">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-slate-100 px-6 pt-4 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-brand-primary bg-brand-bg"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === tab.id
                      ? "bg-brand-primary text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ============================
              TAB 1: PHÊ DUYỆT TÀI XẾ
          ==============================*/}
          {activeTab === "pending" && (
            <div className="p-6">
              {/* Welcome Banner */}
              <div className="flex items-start justify-between mb-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl border border-orange-100">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-brand-text mb-1">
                    Quản lý yêu cầu đăng ký tài xế 👋
                  </h3>
                  <p className="text-sm text-slate-500">
                    Bạn có{" "}
                    <span className="font-bold text-brand-primary">
                      {pendingList.length} yêu cầu
                    </span>{" "}
                    đăng ký tài xế mới đang chờ xử lý hôm nay. Hãy kiểm tra thông tin xe và bằng lái trước khi phê duyệt.
                  </p>
                </div>
                <div className="ml-6 flex-shrink-0 bg-brand-primary text-white rounded-2xl p-4 text-center min-w-[80px]">
                  <div className="text-3xl font-black">
                    {pendingList.length}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-wider mt-1">
                    Chờ duyệt
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm tên, số điện thoại..."
                  value={searchPending}
                  onChange={(e) => setSearchPending(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl text-sm transition-all"
                />
              </div>

              {/* Driver Cards Grid */}
              {filteredPending.length === 0 ? (
                <div className="text-center py-16">
                  <CheckCircle
                    size={48}
                    className="text-green-400 mx-auto mb-4"
                  />
                  <h4 className="text-lg font-black text-brand-text mb-2">
                    Tất cả đã được xử lý!
                  </h4>
                  <p className="text-slate-400 text-sm">
                    Không còn yêu cầu phê duyệt nào đang chờ.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPending.map((driver) => (
                    <div
                      key={driver.id}
                      className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 group"
                    >
                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                           <img
                            src={driver.avatar}
                            alt={driver.name}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                          />
                          <div>
                            <h3 className="text-lg font-black text-brand-text">{driver.name}</h3>
                            <div className="flex items-center gap-2 text-slate-500 mt-1">
                              <Phone size={13} className="text-brand-primary" />
                              <span className="text-xs font-medium">{driver.phone}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin
                              size={13}
                              className="text-brand-primary flex-shrink-0"
                            />
                            <span className="text-xs font-medium truncate">
                              {driver.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Truck
                              size={13}
                              className="text-brand-primary flex-shrink-0"
                            />
                            <span className="text-xs font-medium">
                              {driver.bike}
                            </span>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-brand-bg rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <FileText
                                size={12}
                                className="text-brand-primary"
                              />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                Giấy phép lái xe
                              </span>
                            </div>
                            <div className="text-xs font-black text-brand-text">
                              {driver.license}
                            </div>
                          </div>
                          <div className="bg-brand-bg rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <Clock
                                size={12}
                                className="text-brand-primary"
                              />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                Ngày đăng ký
                              </span>
                            </div>
                            <div className="text-xs font-black text-brand-text">
                              {driver.submittedDate}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(driver)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-premium"
                          >
                            <BadgeCheck size={16} />
                            Phê duyệt
                          </button>
                          <button
                            onClick={() => handleReject(driver)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-bold hover:bg-red-50 hover:text-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <XCircle size={16} />
                            Từ chối
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================
              TAB 2: THÔNG TIN TÀI XẾ
          ==============================*/}
          {activeTab === "info" && (
            <div className="p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative group w-full md:w-96">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm tên, sđt tài xế..."
                    value={searchApproved}
                    onChange={(e) => setSearchApproved(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl text-sm transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-brand-bg border-transparent rounded-xl text-xs font-bold text-slate-500 focus:ring-0 px-4 py-3 cursor-pointer"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="offline">Ngoại tuyến</option>
                    <option value="blocked">Đã khóa</option>
                  </select>
                </div>
              </div>

              {/* Table or Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredApproved.length === 0 ? (
                  <div className="col-span-1 lg:col-span-2 text-center py-12 text-slate-400 text-sm">
                    Không tìm thấy tài xế nào.
                  </div>
                ) : (
                  filteredApproved.map((driver) => (
                    <div key={driver.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 relative overflow-hidden group">
                      <div className="flex items-start gap-5 relative z-10">
                        <div className="relative">
                          <img src={driver.avatar} alt={driver.name} className="w-20 h-20 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform duration-500" />
                          <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 border-[3px] border-white rounded-full ${driver.status === 'Đang hoạt động' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-lg font-bold text-brand-text">{driver.name}</h3>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                              driver.status === 'Đang hoạt động' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                            }`}>
                              {driver.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-4">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Phone size={13} className="text-brand-primary" />
                              <span className="text-xs font-medium">{driver.phone}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Star size={13} className="text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-bold text-brand-text">{driver.rating}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 col-span-2">
                              <Truck size={13} className="text-brand-primary" />
                              <span className="text-xs font-medium">{driver.bike}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center gap-6">
                              <div>
                                <div className="text-[9px] font-bold text-slate-400 uppercase">TỔNG ĐƠN</div>
                                <div className="text-sm font-black text-brand-text">{driver.orders}</div>
                              </div>
                            </div>
                            <button className="px-3 py-1.5 bg-brand-bg text-brand-primary rounded-xl text-xs font-bold hover:bg-brand-primary hover:text-white transition-all">
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredApproved.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-medium">
                    Hiển thị{" "}
                    <span className="font-bold text-brand-text">
                      1-{filteredApproved.length}
                    </span>{" "}
                    trong số{" "}
                    <span className="font-bold text-brand-text">
                      {approvedList.length}
                    </span>{" "}
                    tài xế
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 text-slate-400 hover:text-brand-primary disabled:opacity-50"
                      disabled
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button className="w-8 h-8 rounded-lg text-xs font-bold bg-brand-primary text-white shadow-premium">
                      1
                    </button>
                    <button
                      className="p-2 text-slate-400 hover:text-brand-primary disabled:opacity-50"
                      disabled
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriversPage;

