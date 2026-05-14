import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { PENDING_RESTAURANTS, APPROVED_RESTAURANTS } from "../utils/mockData";
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
  Store,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  BadgeCheck,
  AlertCircle,
  Download,
  Plus,
} from "lucide-react";

// Category badge colors
const CATEGORY_STYLES = {
  fine: "bg-purple-100 text-purple-700",
  traditional: "bg-amber-100 text-amber-700",
  japanese: "bg-pink-100 text-pink-700",
  fastfood: "bg-blue-100 text-blue-700",
  default: "bg-slate-100 text-slate-600",
};

const RestaurantsPage = () => {
  const [activeTab, setActiveTab] = useState("pending"); // default = pending
  const [pendingList, setPendingList] = useState(PENDING_RESTAURANTS);
  const [approvedList, setApprovedList] = useState(APPROVED_RESTAURANTS);
  const [searchPending, setSearchPending] = useState("");
  const [searchApproved, setSearchApproved] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Approve: move from pending to approved
  const handleApprove = (restaurant) => {
    setPendingList((prev) => prev.filter((r) => r.id !== restaurant.id));
    setApprovedList((prev) => [
      {
        id: restaurant.id,
        name: restaurant.name,
        category: restaurant.category,
        rating: restaurant.rating,
        address: restaurant.address,
        ownerName: restaurant.ownerName,
        phone: restaurant.phone,
        email: restaurant.email,
        revenue: "—",
        status: "Hoạt động",
        approvedDate: new Date().toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        image: restaurant.image,
      },
      ...prev,
    ]);
    showToast(`✅ Đã phê duyệt "${restaurant.name}" thành công!`, "success");
  };

  // Reject: remove from pending
  const handleReject = (restaurant) => {
    setPendingList((prev) => prev.filter((r) => r.id !== restaurant.id));
    showToast(`❌ Đã từ chối "${restaurant.name}".`, "error");
  };

  const filteredPending = pendingList.filter(
    (r) =>
      r.name.toLowerCase().includes(searchPending.toLowerCase()) ||
      r.address.toLowerCase().includes(searchPending.toLowerCase()),
  );

  const filteredApproved = approvedList.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchApproved.toLowerCase()) ||
      r.email.toLowerCase().includes(searchApproved.toLowerCase());
    const matchFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && r.status === "Hoạt động") ||
      (filterStatus === "paused" && r.status === "Tạm dừng");
    return matchSearch && matchFilter;
  });

  const tabs = [
    { id: "pending", label: "Phê duyệt nhà hàng", count: pendingList.length },
    { id: "info", label: "Thông tin nhà hàng", count: approvedList.length },
  ];

  return (
    <AdminLayout title="Quản lý Nhà hàng">
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
              Quản lý Nhà hàng
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Phê duyệt đối tác mới và quản lý thông tin nhà hàng trên nền tảng.
            </p>
          </div>
          {activeTab === "info" && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-brand-bg hover:text-brand-primary transition-all">
                <Download size={16} />
                Xuất Excel
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-xl text-xs font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
                <Plus size={16} />
                Thêm nhà hàng
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
              value: approvedList.filter((r) => r.status === "Hoạt động")
                .length,
              icon: CheckCircle,
              color: "text-green-600 bg-green-100",
            },
            {
              label: "TẠM DỪNG",
              value: approvedList.filter((r) => r.status === "Tạm dừng").length,
              icon: AlertCircle,
              color: "text-red-600 bg-red-100",
            },
            {
              label: "TỔNG ĐỐI TÁC",
              value: approvedList.length,
              icon: Store,
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
              TAB 1: PHÊ DUYỆT NHÀ HÀNG
          ==============================*/}
          {activeTab === "pending" && (
            <div className="p-6">
              {/* Welcome Banner */}
              <div className="flex items-start justify-between mb-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl border border-orange-100">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-brand-text mb-1">
                    Chào buổi sáng, Admin Culinary 👋
                  </h3>
                  <p className="text-sm text-slate-500">
                    Bạn có{" "}
                    <span className="font-bold text-brand-primary">
                      {pendingList.length} yêu cầu
                    </span>{" "}
                    phê duyệt nhà hàng mới đang chờ xử lý hôm nay. Hãy xem xét
                    các tài liệu kiểm để đưa ra quyết định.
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

              {/* Filter Tabs */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {["Tất cả yêu cầu", "Đang chờ", "Cần bổ sung", "Gần đây"].map(
                    (f, i) => (
                      <button
                        key={f}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          i === 0
                            ? "bg-brand-primary text-white shadow-premium"
                            : "bg-brand-bg text-slate-500 hover:bg-orange-100 hover:text-brand-primary"
                        }`}
                      >
                        {f}
                      </button>
                    ),
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-brand-bg text-slate-500 rounded-xl text-xs font-bold hover:text-brand-primary transition-colors">
                    <Filter size={14} />
                    Bộ lọc
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 bg-brand-bg text-slate-500 rounded-xl text-xs font-bold hover:text-brand-primary transition-colors">
                    Sắp xếp
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm nhà hàng, giấy phép, địa chỉ..."
                  value={searchPending}
                  onChange={(e) => setSearchPending(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-2xl text-sm transition-all"
                />
              </div>

              {/* Restaurant Cards Grid */}
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
                  {filteredPending.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 group"
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={res.image}
                          alt={res.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        {/* Category Badge */}
                        <div
                          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            CATEGORY_STYLES[res.categoryType] ||
                            CATEGORY_STYLES.default
                          }`}
                        >
                          {res.category}
                        </div>
                        {/* Rating */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-yellow-500 fill-yellow-500"
                          />
                          <span className="text-xs font-black text-brand-text">
                            {res.rating}
                          </span>
                        </div>
                        {/* Name overlay */}
                        <div className="absolute bottom-3 left-3">
                          <h3 className="text-white font-black text-lg drop-shadow">
                            {res.name}
                          </h3>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-5">
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-slate-500">
                            <MapPin
                              size={13}
                              className="text-brand-primary flex-shrink-0"
                            />
                            <span className="text-xs font-medium truncate">
                              {res.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Phone
                              size={13}
                              className="text-brand-primary flex-shrink-0"
                            />
                            <span className="text-xs font-medium">
                              {res.phone}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-500">
                            <Mail
                              size={13}
                              className="text-brand-primary flex-shrink-0"
                            />
                            <span className="text-xs font-medium">
                              {res.email}
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
                                Giấy phép KD
                              </span>
                            </div>
                            <div className="text-xs font-black text-brand-text">
                              {res.license}
                            </div>
                          </div>
                          <div className="bg-brand-bg rounded-2xl p-3">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <TrendingUp
                                size={12}
                                className="text-brand-primary"
                              />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                Dự báo ĐTM
                              </span>
                            </div>
                            <div className="text-xs font-black text-brand-text">
                              {res.revenue}
                            </div>
                          </div>
                        </div>

                        {/* Submitted date */}
                        <div className="flex items-center gap-1.5 text-slate-400 mb-4">
                          <Clock size={12} />
                          <span className="text-[11px] font-medium">
                            Nộp ngày {res.submittedDate}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(res)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold hover:bg-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-premium"
                          >
                            <BadgeCheck size={16} />
                            Phê duyệt
                          </button>
                          <button
                            onClick={() => handleReject(res)}
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
              TAB 2: THÔNG TIN NHÀ HÀNG
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
                    placeholder="Tìm kiếm tên, email nhà hàng..."
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
                    <option value="active">Hoạt động</option>
                    <option value="paused">Tạm dừng</option>
                  </select>
                  <button className="p-3 bg-brand-bg text-slate-500 rounded-xl hover:text-brand-primary transition-colors">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-brand-bg/50">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <input
                          type="checkbox"
                          className="rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20"
                        />
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        NHÀ HÀNG
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        DANH MỤC
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        ĐÁNH GIÁ
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        TRẠNG THÁI
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        NGÀY DUYỆT
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        THAO TÁC
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredApproved.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-6 py-12 text-center text-slate-400 text-sm"
                        >
                          Không tìm thấy nhà hàng nào.
                        </td>
                      </tr>
                    ) : (
                      filteredApproved.map((res) => (
                        <tr
                          key={res.id}
                          className="hover:bg-brand-bg/20 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              className="rounded border-slate-200 text-brand-primary focus:ring-brand-primary/20"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={res.image}
                                alt={res.name}
                                className="w-10 h-10 rounded-2xl object-cover shadow-sm flex-shrink-0"
                              />
                              <div>
                                <div className="text-sm font-bold text-brand-text">
                                  {res.name}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium">
                                  {res.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter bg-orange-50 text-orange-600">
                              {res.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Star
                                size={12}
                                className="text-yellow-500 fill-yellow-500"
                              />
                              <span className="text-xs font-black text-brand-text">
                                {res.rating}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  res.status === "Hoạt động"
                                    ? "bg-green-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              <span
                                className={`text-xs font-bold ${
                                  res.status === "Hoạt động"
                                    ? "text-green-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {res.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">
                            {res.approvedDate}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-bg rounded-lg transition-all">
                              <MoreHorizontal size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
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
                  nhà hàng
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
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantsPage;
