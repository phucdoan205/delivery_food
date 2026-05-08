import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { TOP_RESTAURANTS } from "../utils/mockData";
import { Search, Filter, Plus, Store, Star, MapPin, Phone } from "lucide-react";

const RestaurantsPage = () => {
  return (
    <AdminLayout title="Quản lý Nhà hàng">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Đối tác Nhà hàng</h2>
            <p className="text-sm text-slate-400">Danh sách các nhà hàng đang hoạt động trên nền tảng.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus size={20} />
            Hợp tác mới
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOP_RESTAURANTS.map((res) => (
            <div key={res.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-500 group">
              <div className="h-48 relative">
                <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black text-brand-text">{res.rating}</span>
                </div>
                {res.trending && (
                  <div className="absolute top-4 left-4 bg-brand-primary text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                    Trending
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{res.category}</div>
                <h3 className="text-xl font-bold text-brand-text mb-4 group-hover:text-brand-primary transition-colors">{res.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">123 Đường Lê Lợi, Quận 1, TP.HCM</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone size={14} />
                    <span className="text-xs font-medium">+84 901 234 567</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase">DOANH THU THÁNG</div>
                    <div className="text-lg font-black text-brand-text">{res.revenue}</div>
                  </div>
                  <button className="p-3 bg-brand-bg text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RestaurantsPage;
