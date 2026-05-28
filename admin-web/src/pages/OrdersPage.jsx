  import React, { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Search, Filter, ShoppingBag, ChevronRight, Clock, MapPin, CreditCard, Eye, X } from "lucide-react";
import { request, API_URL } from "../api/client";
import toast from "react-hot-toast";
import io from 'socket.io-client';

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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    let socket;
    fetchOrders();
    const socketUrl = API_URL.replace('/api', '');
    socket = io(socketUrl);
    socket.on('new_order', () => {
      fetchOrders();
    });
    socket.on('order_status_updated', () => {
      fetchOrders();
    });
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const tabs = ["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"];

  const filteredOrdersRaw = orders.filter((order) => {
    if (activeTab === 0) return true;
    if (activeTab === 1) return ["pending", "confirmed", "preparing"].includes(order.status);
    if (activeTab === 2) return order.status === "delivering";
    if (activeTab === 3) return order.status === "completed";
    if (activeTab === 4) return order.status === "cancelled";
    return true;
  });

  const groupedFilteredOrders = [];
  filteredOrdersRaw.forEach(order => {
    const existingGroup = groupedFilteredOrders.find(g => {
      const timeDiff = Math.abs(new Date(g.orders[0].createdAt).getTime() - new Date(order.createdAt).getTime());
      return g.orders[0].userId?._id === order.userId?._id && timeDiff < 5000;
    });

    if (existingGroup) {
      existingGroup.orders.push(order);
      existingGroup.totalPrice += order.totalPrice;
      existingGroup.itemsCount += order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
      if (!existingGroup.restaurantNames.includes(order.restaurantId?.name)) {
        existingGroup.restaurantNames.push(order.restaurantId?.name || 'Nhà hàng');
      }
    } else {
      groupedFilteredOrders.push({
        _id: order._id,
        status: order.status,
        userId: order.userId,
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        itemsCount: order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0,
        restaurantNames: [order.restaurantId?.name || 'Nhà hàng'],
        orders: [order]
      });
    }
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
          ) : groupedFilteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy đơn hàng nào.</div>
          ) : (
            groupedFilteredOrders.map((group) => {
              return (
                <div key={group._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 bg-orange-50 text-brand-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-black text-brand-text">#{group._id.substring(group._id.length - 6).toUpperCase()}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                            statusColors[group.status] || "bg-slate-100 text-slate-600"
                          }`}>
                            {statusLabels[group.status] || group.status}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-slate-600">{group.userId?.fullName || 'Khách hàng ẩn danh'}</div>
                        <div className="text-xs text-slate-400">{group.restaurantNames.join(' & ')} • {group.itemsCount} món</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 flex-1 lg:max-w-xl">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THỜI GIAN</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                          <Clock size={14} className="text-brand-primary" />
                          {group.createdAt ? new Date(group.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THANH TOÁN</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                          <CreditCard size={14} className="text-brand-primary" />
                          {paymentMethodLabels[group.paymentMethod] || 'Tiền mặt'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">TỔNG TIỀN</div>
                        <div className="text-sm font-black text-brand-primary">{group.totalPrice ? group.totalPrice.toLocaleString('vi-VN') : '0'}đ</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setSelectedOrder(group); setIsModalOpen(true); }}
                      className="p-3 bg-slate-50 text-slate-400 hover:text-brand-primary hover:bg-orange-50 rounded-xl transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-brand-text">Chi tiết Đơn hàng #{selectedOrder._id.substring(selectedOrder._id.length - 6).toUpperCase()}</h3>
                <p className="text-sm text-slate-500 mt-1">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-brand-primary bg-white rounded-full shadow-sm hover:shadow-md transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-xs font-bold text-slate-400 uppercase mb-2">Khách hàng</div>
                  <div className="font-bold text-brand-text">{selectedOrder.userId?.fullName || 'Khách hàng ẩn danh'}</div>
                  <div className="text-sm text-slate-500">{selectedOrder.userId?.phone || 'Chưa cập nhật SĐT'}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-bold text-slate-700 mb-3 border-b border-slate-100 pb-2">Chi tiết nhà hàng</div>
                
                {selectedOrder.orders.map((order, orderIdx) => (
                  <div key={order._id} className="mb-6 pb-6 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0">
                    <div className="mb-3">
                      <div className="font-bold text-brand-primary text-base flex items-center gap-2">
                        <ShoppingBag size={18} />
                        {order.restaurantId?.name || 'Nhà hàng đối tác'}
                      </div>
                      <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-400" />
                        {order.restaurantId?.address || 'Chưa cập nhật địa chỉ'}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 border border-slate-100 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              {item.foodId?.image ? (
                                <img src={item.foodId.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-slate-200"></div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-brand-text">{item.foodId?.name || 'Món ăn'}</div>
                              <div className="text-xs text-slate-500">{item.quantity} x {item.price?.toLocaleString('vi-VN')}đ</div>
                            </div>
                          </div>
                          <div className="font-bold text-brand-text">
                            {((item.price || 0) * (item.quantity || 1)).toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Phí giao hàng</span>
                        <span className="font-bold">{order.shippingFee?.toLocaleString('vi-VN') || 0}đ</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-600">Giảm giá</span>
                          <span className="font-bold text-green-600">-{order.discountAmount?.toLocaleString('vi-VN')}đ</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 mt-2 border-t border-slate-200">
                        <span className="font-bold text-slate-600">Tạm tính nhà hàng này</span>
                        <span className="font-bold text-brand-text">{order.totalPrice?.toLocaleString('vi-VN') || 0}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50/50 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-base border-slate-200">
                  <span className="font-black text-brand-text">Tổng thanh toán toàn bộ đơn</span>
                  <span className="font-black text-brand-primary">{selectedOrder.totalPrice?.toLocaleString('vi-VN') || 0}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrdersPage;
