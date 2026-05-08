import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { DASHBOARD_STATS, REVENUE_DATA, TOP_RESTAURANTS, TOP_DISHES } from "../utils/mockData";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ShoppingBag, 
  CheckCircle, 
  Users,
  ChevronRight,
  Star,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const iconMap = {
  Wallet,
  ShoppingBag,
  CheckCircle,
  Users,
};

const DashboardPage = () => {
  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">Cập nhật lần cuối: 10 phút trước</p>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
            {["Hôm nay", "Tuần này", "Tháng này", "Tùy chỉnh"].map((tab, i) => (
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_STATS.map((stat) => {
            const Icon = iconMap[stat.icon];
            return (
              <div key={stat.title} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-premium transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={24} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
                    stat.trendType === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {stat.trendType === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {stat.trend}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.title}</div>
                <div className="text-2xl font-black text-brand-text">{stat.value}</div>
                <div className="mt-2 text-[10px] text-slate-400 font-medium">so với hôm qua</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-brand-text">Phân tích Doanh thu</h3>
                <p className="text-sm text-slate-400">Biến động theo giờ trong ngày</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                  <span className="text-xs font-bold text-slate-500">Thực tế</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                  <span className="text-xs font-bold text-slate-500">Dự báo</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REVENUE_DATA}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E65100" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#E65100" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fontWeight: 600, fill: '#94a3b8'}}
                    tickFormatter={(val) => `${val}k`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#E65100" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#FFCCBC" 
                    strokeWidth={2} 
                    strokeDasharray="5 5" 
                    fill="none" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Trends */}
          <div className="bg-brand-primary p-8 rounded-[32px] text-white shadow-premium relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Xu hướng đơn hàng</h3>
              <p className="text-orange-100 text-sm leading-relaxed">Đỉnh điểm đơn hàng diễn ra lúc 11:30 - 13:00 hàng ngày, chiếm 42% tổng lượng đơn.</p>
            </div>
            
            <div className="mt-8 space-y-6 relative z-10">
              {[
                { label: "HÔM NAY", value: "1.840 ĐƠN", color: "bg-green-400" },
                { label: "HÔM QUA", value: "1.620 ĐƠN", color: "bg-orange-300" },
                { label: "TRUNG BÌNH TUẦN", value: "1.450 ĐƠN", color: "bg-orange-400" },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black tracking-widest opacity-80 uppercase">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: '70%' }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-10">
              <ShoppingBag size={200} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Restaurants */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-brand-primary rounded-xl">
                  <Store size={20} />
                </div>
                <h3 className="text-lg font-bold text-brand-text uppercase tracking-tight">TOP NHÀ HÀNG</h3>
              </div>
              <button className="text-xs font-bold text-brand-primary hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-6">
              {TOP_RESTAURANTS.map((res, i) => (
                <div key={res.id} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm">
                    <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {res.trending && (
                        <span className="text-[8px] font-black bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">#1 TRENDING</span>
                      )}
                      <h4 className="font-bold text-brand-text truncate">{res.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{res.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold ml-1">{res.rating}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{res.reviews} đơn</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">DOANH THU</div>
                    <div className="font-black text-brand-primary">{res.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Dishes */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-50 text-brand-primary rounded-xl">
                  <UtensilsCrossed size={20} />
                </div>
                <h3 className="text-lg font-bold text-brand-text uppercase tracking-tight">MÓN ĂN BÁN CHẠY</h3>
              </div>
              <button className="text-xs font-bold text-brand-primary hover:underline">Chi tiết</button>
            </div>
            <div className="space-y-6">
              {TOP_DISHES.map((dish, i) => (
                <div key={dish.id} className="flex items-center gap-4 group">
                  <div className="relative">
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-[10px] font-black shadow-premium z-10">
                      {i + 1}
                    </div>
                    <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-brand-text truncate">{dish.name}</h4>
                    <p className="text-xs text-slate-400">{dish.description}</p>
                    <div className="mt-1">
                      <span className="text-xs font-black text-brand-primary">{dish.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-brand-bg text-brand-primary px-2 py-1 rounded-full uppercase tracking-tighter">
                      {dish.orders}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;
