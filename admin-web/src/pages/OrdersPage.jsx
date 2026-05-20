import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Search, Filter, ShoppingBag, ChevronRight, Clock, MapPin, CreditCard } from "lucide-react";
import { request } from "../api/client";
import toast from "react-hot-toast";

const statusColors = {
  pending: "bg-amber-100 text-amber-600",
  confirmed: "bg-blue-100 text-blue-600",
  preparing: "bg-indigo-100 text-indigo-600",
  delivering: "bg-purple-100 text-purple-600",
  completed: "bg-green-100 text-green-600",
  cancelled: "bg-red-100 text-red-600"
};

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivering: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy"
};

const paymentMethodLabels = {
  cash: "Tiền mặt",
  momo: "Ví MoMo",
  zalopay: "Ví ZaloPay"
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const fetchOrders = async () => {
    try {
      const data = await request("/orders/admin");
      setOrders(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const tabs = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"];

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return ["pending", "confirmed", "preparing"].includes(order.status);
    if (activeTab === 2) return order.status === "delivering";
    if (activeTab === 3) return order.status === "completed";
    if (activeTab === 4) return order.status === "cancelled";
    return true;
  });

  return (
    <AdminLayout title="Quản lý Đơn hàng">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Đơn hàng</h2>
            <p className="text-sm text-slate-400">Theo dõi và quản lý các đơn hàng đang diễn ra.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {tabs.map((tab, i) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === i ? "bg-brand-primary text-white shadow-premium" : "text-slate-500 hover:text-brand-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">Đang tải danh sách đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy đơn hàng nào.</div>
          ) : (
            filteredOrders.map((order) => {
              const itemsCount = order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
              return (
                <div key={order._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-orange-50 text-brand-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-black text-brand-text">#{order._id.substring(order._id.length - 6).toUpperCase()}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            statusColors[order.status] || "bg-slate-100 text-slate-600"
                          }`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-600">{order.userId?.fullName || 'Khách hàng ẩn danh'}</div>
                        <div className="text-xs text-slate-400">{order.restaurantId?.name || 'Nhà hàng'} • {itemsCount} món</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 lg:max-w-2xl">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THỜI GIAN</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                          <Clock size={14} className="text-brand-primary" />
                          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">ĐỊA ĐIỂM</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text truncate max-w-[120px]" title={order.deliveryAddress}>
                          <MapPin size={14} className="text-brand-primary" />
                          {order.deliveryAddress || 'Quận 1, TP.HCM'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THANH TOÁN</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                          <CreditCard size={14} className="text-brand-primary" />
                          {paymentMethodLabels[order.paymentMethod] || 'Tiền mặt'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">TỔNG TIỀN</div>
                        <div className="text-sm font-black text-brand-primary">{order.totalPrice ? order.totalPrice.toLocaleString('vi-VN') : '0'}đ</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
