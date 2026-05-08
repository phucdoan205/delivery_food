import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { Truck, Star, MapPin, Phone, MoreHorizontal, UserCheck } from "lucide-react";

const mockDrivers = [
  { id: 1, name: "Lê Văn Hùng", avatar: "https://i.pravatar.cc/150?u=hung", phone: "0901 234 567", status: "Đang hoạt động", rating: 4.8, orders: 1240, bike: "Honda AirBlade - 59-P1 123.45" },
  { id: 2, name: "Phạm Minh Tuấn", avatar: "https://i.pravatar.cc/150?u=tuan", phone: "0908 765 432", status: "Ngoại tuyến", rating: 4.9, orders: 850, bike: "Yamaha Exciter - 59-S2 678.90" },
];

const DriversPage = () => {
  return (
    <AdminLayout title="Quản lý Tài xế">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Đối tác Tài xế</h2>
            <p className="text-sm text-slate-400">Quản lý và theo dõi đội ngũ giao hàng của bạn.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
            <UserCheck size={20} />
            Kích hoạt tài xế mới
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockDrivers.map((driver) => (
            <div key={driver.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-start gap-6 relative z-10">
                <div className="relative">
                  <img src={driver.avatar} alt={driver.name} className="w-24 h-24 rounded-3xl object-cover shadow-md group-hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 border-4 border-white rounded-full ${driver.status === 'Đang hoạt động' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-brand-text">{driver.name}</h3>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                      driver.status === 'Đang hoạt động' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {driver.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Phone size={14} />
                      <span className="text-xs font-medium">{driver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-brand-text">{driver.rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 col-span-2">
                      <Truck size={14} />
                      <span className="text-xs font-medium">{driver.bike}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">TỔNG ĐƠN</div>
                        <div className="font-black text-brand-text">{driver.orders}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">THU NHẬP</div>
                        <div className="font-black text-brand-primary">12.5M</div>
                      </div>
                    </div>
                    <button className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 p-4">
                <button className="text-slate-300 hover:text-brand-primary transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="absolute -bottom-8 -right-8 text-brand-primary opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Truck size={120} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default DriversPage;
