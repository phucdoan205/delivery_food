import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Search, Filter, ShoppingBag, ChevronRight, Clock, MapPin, CreditCard } from "lucide-react";

const mockOrders = [
  { id: "#ORD-9921", customer: "Nguyễn Hoàng Nam", restaurant: "Le Gourmet Parisian", items: 3, total: "540.000đ", status: "Đang giao", time: "10 phút trước" },
  { id: "#ORD-9920", customer: "Lê Thị Lan", restaurant: "Phở Gia Truyền 1980", items: 1, total: "85.000đ", status: "Hoàn tất", time: "25 phút trước" },
  { id: "#ORD-9919", customer: "Trần Minh Tâm", restaurant: "Pizza Margherita Củi", items: 2, total: "440.000đ", status: "Đã hủy", time: "1 giờ trước" },
];

const OrdersPage = () => {
  return (
    <AdminLayout title="Quản lý Đơn hàng">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Đơn hàng</h2>
            <p className="text-sm text-slate-400">Theo dõi và quản lý các đơn hàng đang diễn ra.</p>
          </div>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {["Tất cả", "Đang xử lý", "Đang giao", "Hoàn tất", "Đã hủy"].map((tab, i) => (
              <button 
                key={tab} 
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  i === 0 ? "bg-brand-primary text-white shadow-premium" : "text-slate-500 hover:text-brand-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-4 bg-orange-50 text-brand-primary rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm font-black text-brand-text">{order.id}</span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                        order.status === 'Hoàn tất' ? 'bg-green-100 text-green-600' :
                        order.status === 'Đang giao' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-600">{order.customer}</div>
                    <div className="text-xs text-slate-400">{order.restaurant} • {order.items} món</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1 lg:max-w-2xl">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THỜI GIAN</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                      <Clock size={14} className="text-brand-primary" />
                      {order.time}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">ĐỊA ĐIỂM</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text truncate max-w-[120px]">
                      <MapPin size={14} className="text-brand-primary" />
                      Quận 1, TP.HCM
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">THANH TOÁN</div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-brand-text">
                      <CreditCard size={14} className="text-brand-primary" />
                      Tiền mặt
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">TỔNG TIỀN</div>
                    <div className="text-sm font-black text-brand-primary">{order.total}</div>
                  </div>
                </div>

                <button className="p-4 bg-brand-bg text-brand-primary rounded-2xl hover:bg-brand-primary hover:text-white transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
