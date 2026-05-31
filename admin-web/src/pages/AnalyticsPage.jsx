import React, { useState, useEffect, useMemo } from "react";
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
import { request } from "../api/client";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const AnalyticsPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("Hôm nay");

  const fetchAnalyticsData = async () => {
    try {
      const [uData, oData, rData] = await Promise.all([
        request("/auth/users"),
        request("/orders/admin"),
        request("/restaurants/admin")
      ]);
      setUsers(uData);
      setOrders(oData);
      setRestaurants(rData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu phân tích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();

    const socket = io("http://localhost:5000");
    
    socket.on("new_order", () => fetchAnalyticsData());
    socket.on("order_status_updated", () => fetchAnalyticsData());
    socket.on("new_user_registered", () => fetchAnalyticsData());
    socket.on("user_profile_updated", () => fetchAnalyticsData());
    socket.on("restaurant_updated", () => fetchAnalyticsData());

    return () => {
      socket.disconnect();
    };
  }, []);

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M đ";
    }
    return value.toLocaleString('vi-VN') + " đ";
  };

  const { 
    filteredOrders, 
    totalRevenue, 
    completionRate, 
    revenueData, 
    topRestaurants, 
    topFoods, 
    peakHourStr, 
    peakOrders,
    eveningOrders
  } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const fOrders = orders.filter(o => {
      const oDate = new Date(o.createdAt);
      if (timeFilter === "Hôm nay") {
        return oDate >= startOfToday;
      } else {
        return oDate >= startOfYesterday && oDate < startOfToday;
      }
    });

    const allCompletedOrders = orders.filter(o => o.status === "completed");
    const tRev = allCompletedOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
    const compRate = orders.length > 0 ? ((allCompletedOrders.length / orders.length) * 100).toFixed(1) : "100.0";

    const completedOrders = fOrders.filter(o => o.status === "completed");

    // Revenue Chart Data (aggregate by 3-hour blocks)
    const revData = [
      { time: "00:00", revenue: 0 },
      { time: "03:00", revenue: 0 },
      { time: "06:00", revenue: 0 },
      { time: "09:00", revenue: 0 },
      { time: "12:00", revenue: 0 },
      { time: "15:00", revenue: 0 },
      { time: "18:00", revenue: 0 },
      { time: "21:00", revenue: 0 }
    ];

    completedOrders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      const bucketIndex = Math.floor(h / 3);
      if (revData[bucketIndex]) {
        revData[bucketIndex].revenue += o.totalPrice || 0;
      }
    });

    // Top Restaurants
    const rMap = {};
    completedOrders.forEach(o => {
      const rId = o.restaurantId?._id?.toString() || o.restaurantId;
      if (!rMap[rId]) {
        rMap[rId] = { id: rId, name: o.restaurantId?.name || "Unknown", revenue: 0 };
      }
      rMap[rId].revenue += o.totalPrice || 0;
    });

    const tRes = Object.values(rMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(r => {
        const rDetail = restaurants.find(res => res._id === r.id);
        return {
          ...r,
          image: rDetail?.image,
          rating: rDetail?.rating || 5.0,
          reviewCount: rDetail?.reviews?.length || 0
        };
      });

    // Top Foods
    const fMap = {};
    completedOrders.forEach(o => {
      o.items?.forEach(item => {
        const fId = item.foodId?._id?.toString() || item.foodId;
        if (!fMap[fId]) {
          fMap[fId] = {
            id: fId,
            name: item.foodId?.name || "Món ăn",
            image: item.foodId?.image,
            restaurantName: o.restaurantId?.name || "Cửa hàng",
            count: 0
          };
        }
        fMap[fId].count += item.quantity || 1;
      });
    });

    const tFoods = Object.values(fMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Peak hours
    const hCounts = new Array(24).fill(0);
    fOrders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      hCounts[h]++;
    });

    let pHour = 12;
    let mOrders = 0;
    hCounts.forEach((count, idx) => {
      if (count > mOrders) {
        mOrders = count;
        pHour = idx;
      }
    });

    const pHourStr = `${pHour.toString().padStart(2, '0')}:00 - ${(pHour+1).toString().padStart(2, '0')}:00`;
    const evOrders = hCounts[18] + hCounts[19] + hCounts[20];

    return {
      filteredOrders: fOrders,
      totalRevenue: tRev,
      completionRate: compRate,
      revenueData: revData,
      topRestaurants: tRes,
      topFoods: tFoods,
      peakHourStr: pHourStr,
      peakOrders: mOrders,
      eveningOrders: evOrders
    };
  }, [orders, restaurants, timeFilter]);

  const stats = [
    { label: "Tổng doanh thu", value: formatCurrency(totalRevenue), trend: "+12.5%", time: "cập nhật trực tiếp", up: true },
    { label: "Tổng đơn hàng", value: `${orders.length} đơn`, trend: "+5.2%", time: "cập nhật trực tiếp", up: true },
    { label: "Tỷ lệ hoàn tất", value: `${completionRate}%`, custom: true },
    { label: "Tổng người dùng", value: `${users.length}`, trend: "+15.3%", time: "cập nhật trực tiếp", up: true },
  ];

  return (
    <AdminLayout title="Phân tích">
      <div className="space-y-6 max-w-7xl pb-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-brand-text mb-1">Phân tích chuyên sâu</h2>
            <p className="text-sm text-brand-text-muted">Tổng quan hiệu suất và dữ liệu vận hành {timeFilter.toLowerCase()}</p>
          </div>
        </div>

        {/* 4 Stats Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-brand-surface p-6 rounded-[24px] shadow-sm border border-brand-border flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-2 flex justify-between items-center">
                  {stat.label}
                  {!stat.custom && <div className="w-6 h-6 rounded-full bg-brand-bg text-[#A04F2D] flex items-center justify-center">❖</div>}
                  {stat.custom && <div className="w-6 h-6 rounded-full bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center">✓</div>}
                </div>
                <div className="text-2xl font-black text-brand-text">{stat.value}</div>
              </div>
              
              {!stat.custom ? (
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold">
                  <span className={`flex items-center gap-0.5 ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.up ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                    {stat.trend}
                  </span>
                  <span className="text-brand-text-muted">{stat.time}</span>
                </div>
              ) : (
                <div className="mt-4">
                  <div className="h-1.5 w-full bg-brand-border rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts & Trends Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-brand-surface p-8 rounded-[32px] shadow-sm border border-brand-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-brand-text">Biểu đồ doanh thu</h3>
              <div className="flex bg-brand-bg p-1 rounded-full">
                {["Hôm nay", "Hôm qua"].map((tab) => (
                  <button 
                    key={tab}
                    onClick={() => setTimeFilter(tab)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                      timeFilter === tab ? "bg-[#FFEBE5] text-[#A04F2D] shadow-sm" : "text-brand-text-muted hover:text-brand-text"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="h-[250px] w-full bg-brand-bg rounded-2xl relative flex items-center justify-center border border-[#FFEBE5]">
              <div className="absolute inset-0 p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRev2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A04F2D" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#A04F2D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#FFEBE5" />
                    <Tooltip 
                      cursor={{fill: 'transparent'}} 
                      contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#5C3D2E', color: '#fff', fontWeight: 'bold' }} 
                      formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']}
                    />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#8C6B5D', fontWeight: 'bold'}} dy={10} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="revenue" stroke="#A04F2D" strokeWidth={3} fillOpacity={1} fill="url(#colorRev2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {revenueData.every(d => d.revenue === 0) && (
                <span className="text-brand-text-muted text-sm font-bold z-10 pointer-events-none opacity-50 bg-brand-bg/80 px-4 py-2 rounded-xl backdrop-blur-sm">Chưa có doanh thu</span>
              )}
            </div>
          </div>

          {/* Side Trends */}
          <div className="bg-brand-surface p-8 rounded-[32px] shadow-sm border border-brand-border flex flex-col">
            <h3 className="text-lg font-bold text-brand-text mb-6">Xu hướng đơn hàng</h3>
            <div className="flex-1 flex flex-col gap-4">
              <div className="bg-brand-bg p-5 rounded-2xl">
                <div className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-2">KHUNG GIỜ CAO ĐIỂM THỰC TẾ</div>
                <div className="flex items-center gap-2 text-2xl font-black text-[#A04F2D] mb-1">
                  <Clock size={20} />
                  {peakHourStr}
                </div>
                <div className="text-xs text-brand-text-muted">Ghi nhận: <span className="font-bold text-brand-text">{peakOrders} đơn / giờ</span></div>
              </div>

              <div className="bg-brand-bg p-5 rounded-2xl">
                <div className="text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-2">ĐƠN HÀNG BUỔI TỐI (18:00-21:00)</div>
                <div className="flex items-center gap-2 text-2xl font-black text-brand-text mb-1">
                  <Clock size={20} />
                  18:00 - 21:00
                </div>
                <div className="text-xs text-brand-text-muted">Tổng số: <span className="font-bold text-brand-text">{eveningOrders} đơn</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Top Lists Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-brand-surface p-6 rounded-[32px] shadow-sm border border-brand-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-brand-text">Top Nhà hàng {timeFilter.toLowerCase()}</h3>
            </div>
            <div className="space-y-4">
              {topRestaurants.length > 0 ? topRestaurants.map((res, i) => (
                <div key={res.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-border overflow-hidden text-lg font-black text-brand-text-muted flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-border overflow-hidden">
                      <img src={res.image} alt="Res" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-text">{res.name}</div>
                      <div className="text-[10px] text-brand-text-muted font-bold">★ {res.rating.toFixed(1)} ({res.reviewCount} đánh giá)</div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-[#A04F2D]">{formatCurrency(res.revenue)}</div>
                </div>
              )) : (
                <div className="text-center py-4 text-sm text-brand-text-muted font-medium">Chưa có dữ liệu nhà hàng</div>
              )}
            </div>
          </div>

          <div className="bg-brand-surface p-6 rounded-[32px] shadow-sm border border-brand-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-brand-text">Món ăn bán chạy {timeFilter.toLowerCase()}</h3>
            </div>
            <div className="space-y-4">
              {topFoods.length > 0 ? topFoods.map((food, i) => (
                <div key={food.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-border overflow-hidden text-lg font-black text-brand-text-muted flex items-center justify-center">
                      {i + 1}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-brand-border overflow-hidden">
                      <img src={food.image} alt="Dish" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-text line-clamp-1 max-w-[150px]">{food.name}</div>
                      <div className="text-[10px] text-brand-text-muted font-bold line-clamp-1 max-w-[150px]">{food.restaurantName}</div>
                    </div>
                  </div>
                  <div className="text-xs font-black text-brand-text">{food.count} <span className="font-medium text-brand-text-muted">phần</span></div>
                </div>
              )) : (
                <div className="text-center py-4 text-sm text-brand-text-muted font-medium">Chưa có dữ liệu món ăn</div>
              )}
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
