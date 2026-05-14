import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { TrendingUp, TrendingDown, Clock, Search } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";

const REVENUE_DATA = [
  { time: "06:00", revenue: 400 },
  { time: "09:00", revenue: 300 },
  { time: "12:00", revenue: 600 },
  { time: "15:00", revenue: 800 },
  { time: "18:00", revenue: 1100 },
  { time: "21:00", revenue: 500 },
  { time: "00:00", revenue: 900 },
];

const AnalyticsPage = () => {
  return (
    <AdminLayout title="Phân tích">
      <div className="space-y-6 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-[#5C3D2E] mb-1">Phân tích chuyên sâu</h2>
            <p className="text-sm text-[#8C6B5D]">Tổng quan hiệu suất và dữ liệu vận hành hôm nay</p>
          </div>
          <div className="relative group w-full md:w-[300px]">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#8C6B5D]">
              <Search size={16} />
            </div>
            <input 
              type="text" 
              placeholder="Tìm kiếm dữ liệu..." 
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-100 focus:border-[#D98C72] focus:ring-0 rounded-2xl text-sm transition-all"
            />
          </div>
        </div>

        {/* 4 Stats Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tổng doanh thu", value: "124.5Mđ", trend: "+12.5%", time: "so với hôm qua", up: true },
            { label: "Tổng đơn hàng", value: "1,482", trend: "+5.2%", time: "so với hôm qua", up: true },
            { label: "Tỷ lệ hoàn tất", value: "96.8%", custom: true },
            { label: "Người dùng mới", value: "+342", trend: "-2.1%", time: "so với tuần trước", up: false },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-[#8C6B5D] uppercase tracking-widest mb-2 flex justify-between items-center">
                  {stat.label}
                  {!stat.custom && <div className="w-6 h-6 rounded-full bg-[#FFF5F2] text-[#A04F2D] flex items-center justify-center">❖</div>}
                  {stat.custom && <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">✓</div>}
                </div>
                <div className="text-2xl font-black text-[#5C3D2E]">{stat.value}</div>
              </div>
              
              {!stat.custom ? (
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold">
                  <span className={`flex items-center gap-0.5 ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {stat.trend}
                  </span>
                  <span className="text-slate-400">{stat.time}</span>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '96.8%' }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts & Trends Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#5C3D2E]">Biểu đồ doanh thu</h3>
              <div className="flex bg-[#FFF5F2] p-1 rounded-full">
                {["Hôm nay", "Hôm qua"].map((tab, idx) => (
                  <button 
                    key={tab}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                      idx === 0 ? "bg-[#FFEBE5] text-[#A04F2D] shadow-sm" : "text-[#8C6B5D] hover:text-[#5C3D2E]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[250px] w-full bg-[#FFF5F2] rounded-2xl relative flex items-center justify-center border border-[#FFEBE5]">
              <div className="absolute inset-0 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_DATA}>
                    <defs>
                      <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A04F2D" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#A04F2D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFEBE5" />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#A04F2D" strokeWidth={3} fillOpacity={1} fill="url(#colorRev2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <span className="text-[#8C6B5D] text-sm font-bold z-10 pointer-events-none opacity-50 bg-[#FFF5F2]/80 px-4 py-2 rounded-xl backdrop-blur-sm">[Chart Visualization Area - Revenue over hours]</span>
            </div>
          </div>

          {/* Side Trends */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 flex flex-col">
            <h3 className="text-lg font-bold text-[#5C3D2E] mb-6">Xu hướng đơn hàng</h3>
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-[#FFF5F2] p-5 rounded-2xl">
                <div className="text-[10px] font-black text-[#8C6B5D] uppercase tracking-widest mb-2">KHUNG GIỜ CAO ĐIỂM DỰ KIẾN</div>
                <div className="flex items-center gap-2 text-2xl font-black text-[#A04F2D] mb-1">
                  <Clock size={20} />
                  11:30 - 13:00
                </div>
                <div className="text-xs text-[#8C6B5D]">Dự báo: <span className="font-bold text-[#5C3D2E]">~450 đơn / giờ</span></div>
              </div>

              <div className="bg-[#FFF5F2] p-5 rounded-2xl">
                <div className="text-[10px] font-black text-[#8C6B5D] uppercase tracking-widest mb-2">KHUNG GIỜ TỐI</div>
                <div className="flex items-center gap-2 text-2xl font-black text-[#5C3D2E] mb-1">
                  <Clock size={20} />
                  18:00 - 20:30
                </div>
                <div className="text-xs text-[#8C6B5D]">Dự báo: <span className="font-bold text-[#5C3D2E]">~320 đơn / giờ</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Top Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#5C3D2E]">Top Nhà hàng</h3>
              <button className="text-xs font-bold text-[#A04F2D] hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100&h=100&fit=crop" alt="Res" className="w-full h-full object-cover"/></div>
                  <div>
                    <div className="text-sm font-bold text-[#5C3D2E]">Bistro De Paris</div>
                    <div className="text-[10px] text-[#8C6B5D] font-bold">★ 4.9 (245 đánh giá)</div>
                  </div>
                </div>
                <div className="text-sm font-black text-[#A04F2D]">32.4M đ</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" alt="Res" className="w-full h-full object-cover"/></div>
                  <div>
                    <div className="text-sm font-bold text-[#5C3D2E]">Napoli Pizzeria</div>
                    <div className="text-[10px] text-[#8C6B5D] font-bold">★ 4.8 (189 đánh giá)</div>
                  </div>
                </div>
                <div className="text-sm font-black text-[#A04F2D]">28.1M đ</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-[#5C3D2E]">Món ăn bán chạy</h3>
              <button className="text-xs font-bold text-[#A04F2D] hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" alt="Dish" className="w-full h-full object-cover"/></div>
                  <div>
                    <div className="text-sm font-bold text-[#5C3D2E]">Salad Quinoa Bơ</div>
                    <div className="text-[10px] text-[#8C6B5D] font-bold">Healthy Greens Co.</div>
                  </div>
                </div>
                <div className="text-xs font-black text-[#5C3D2E]">184 <span className="font-medium text-[#8C6B5D]">phần</span></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden"><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100&h=100&fit=crop" alt="Dish" className="w-full h-full object-cover"/></div>
                  <div>
                    <div className="text-sm font-bold text-[#5C3D2E]">Classic Smash Burger</div>
                    <div className="text-[10px] text-[#8C6B5D] font-bold">Burger Joint</div>
                  </div>
                </div>
                <div className="text-xs font-black text-[#5C3D2E]">156 <span className="font-medium text-[#8C6B5D]">phần</span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
