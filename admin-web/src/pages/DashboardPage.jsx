import React, { useState, useEffect, useMemo } from "react";
import AdminLayout from "../layouts/AdminLayout";

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
} from "recharts";
import { request } from "../api/client";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const iconMap = {
  Wallet,
  ShoppingBag,
  CheckCircle,
  Users,
};

const DashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
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
      toast.error("Không thể tải thông tin tổng quan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const socket = io("http://localhost:5000");
    
    socket.on("new_order", () => fetchDashboardData());
    socket.on("order_status_updated", () => fetchDashboardData());
    socket.on("new_user_registered", () => fetchDashboardData());
    socket.on("restaurant_updated", () => fetchDashboardData());

    return () => {
      socket.disconnect();
    };
  }, []);

  const totalRevenue = orders
    .filter(o => o.status === "completed")
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const activeRestaurants = restaurants.filter(r => r.status === "approved").length;

  const dynamicRevenueData = useMemo(() => {
    const buckets = { "06:00": 0, "09:00": 0, "12:00": 0, "15:00": 0, "18:00": 0, "21:00": 0, "00:00": 0 };
    orders.filter(o => o.status === "completed").forEach(o => {
      const h = new Date(o.createdAt).getHours();
      let bucket = "00:00";
      if (h >= 6 && h < 9) bucket = "06:00";
      else if (h >= 9 && h < 12) bucket = "09:00";
      else if (h >= 12 && h < 15) bucket = "12:00";
      else if (h >= 15 && h < 18) bucket = "15:00";
      else if (h >= 18 && h < 21) bucket = "18:00";
      else if (h >= 21) bucket = "21:00";
      buckets[bucket] += (o.totalPrice || 0) / 1000;
    });
    return Object.keys(buckets).map(time => ({ time, revenue: buckets[time], forecast: Math.round(buckets[time] * 1.2) }));
  }, [orders]);

  const orderTrends = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    let todayCount = 0;
    let yesterdayCount = 0;
    let weekCount = 0;
    
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const hourCounts = new Array(24).fill(0);

    orders.forEach(o => {
      const oDate = new Date(o.createdAt);
      if (oDate >= startOfToday) {
        todayCount++;
        hourCounts[oDate.getHours()]++;
      } else if (oDate >= startOfYesterday && oDate < startOfToday) {
        yesterdayCount++;
      }
      
      if (oDate >= startOfWeek) {
        weekCount++;
      }
    });

    let peakHour = 12;
    let maxOrders = 0;
    hourCounts.forEach((count, idx) => {
      if (count > maxOrders) {
        maxOrders = count;
        peakHour = idx;
      }
    });
    
    const peakHourStr = `${peakHour.toString().padStart(2, '0')}:00 - ${(peakHour+1).toString().padStart(2, '0')}:00`;
    const peakPercentage = todayCount > 0 ? Math.round((maxOrders / todayCount) * 100) : 0;
    const avgWeek = Math.round(weekCount / 7);
    const maxVal = Math.max(todayCount, yesterdayCount, avgWeek) || 1;

    return {
      peakHourStr,
      peakPercentage,
      todayCount,
      yesterdayCount,
      avgWeek,
      maxVal
    };
  }, [orders]);

  const dynamicTopRestaurants = useMemo(() => {
    const resStats = {};
    orders.filter(o => o.status === "completed").forEach(o => {
      const rid = o.restaurantId?._id;
      if (!rid) return;
      if (!resStats[rid]) resStats[rid] = { count: 0, revenue: 0, res: o.restaurantId };
      resStats[rid].count += 1;
      resStats[rid].revenue += o.totalPrice || 0;
    });
    restaurants.forEach(r => {
      if (!resStats[r._id]) resStats[r._id] = { count: 0, revenue: 0, res: r };
    });
    return Object.values(resStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3)
      .map((stat, i) => {
        const realRes = restaurants.find(r => r._id === stat.res._id) || stat.res;
        return {
          id: realRes._id,
          name: realRes.name,
          category: "Nhà hàng",
          rating: realRes.rating || 5.0,
          reviews: stat.count,
          revenue: stat.revenue > 1000000 ? (stat.revenue/1000000).toFixed(1) + 'M' : (stat.revenue/1000).toFixed(0) + 'k',
          image: realRes.image,
          trending: i === 0 && stat.revenue > 0
        };
      });
  }, [orders, restaurants]);

  const dynamicTopDishes = useMemo(() => {
    const dishStats = {};
    orders.filter(o => o.status === "completed").forEach(o => {
      if (o.items) {
        o.items.forEach(item => {
          const fid = item.foodId?._id;
          if (!fid) return;
          if (!dishStats[fid]) dishStats[fid] = { count: 0, food: item.foodId };
          dishStats[fid].count += item.quantity || 1;
        });
      }
    });
    return Object.values(dishStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((stat, i) => ({
        id: stat.food._id,
        name: stat.food.name,
        description: stat.food.description || "Món ăn",
        price: (stat.food.price || 0).toLocaleString('vi-VN') + 'đ',
        orders: stat.count + " Lượt mua",
        image: stat.food.image
      }));
  }, [orders]);

  const stats = [
    { title: "Doanh thu", value: `${totalRevenue.toLocaleString('vi-VN')}đ`, icon: "Wallet", color: "text-amber-600 bg-amber-50", trend: "+12.5%", trendType: "up" },
    { title: "Số đơn hàng", value: `${orders.length} đơn`, icon: "ShoppingBag", color: "text-blue-600 bg-blue-50", trend: "+8.2%", trendType: "up" },
    { title: "Đối tác nhà hàng", value: `${activeRestaurants} quán`, icon: "CheckCircle", color: "text-green-600 bg-green-50", trend: "+2.4%", trendType: "up" },
    { title: "Tổng người dùng", value: `${users.length} tài khoản`, icon: "Users", color: "text-purple-600 bg-purple-50", trend: "+15.3%", trendType: "up" }
  ];

  return (
    <AdminLayout title="Tổng quan hệ thống">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-brand-text-muted font-medium">Hệ thống quản trị thời gian thực</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon];
            return (
              <div key={stat.title} className="bg-brand-surface p-6 rounded-3xl shadow-sm border border-brand-border hover:shadow-premium transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                    <Icon size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg bg-green-50 text-green-600">
                    <TrendingUp size={12} />
                    {stat.trend}
                  </div>
                </div>
                <div className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-1">{stat.title}</div>
                <div className="text-2xl font-black text-brand-text">{stat.value}</div>
                <div className="mt-2 text-[10px] text-brand-text-muted font-medium">cập nhật trực tiếp</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-brand-surface p-8 rounded-[32px] shadow-sm border border-brand-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-brand-text">Phân tích Doanh thu</h3>
                <p className="text-sm text-brand-text-muted">Biến động theo giờ trong ngày</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-primary"></div>
                  <span className="text-xs font-bold text-brand-text-muted">Thực tế</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-200"></div>
                  <span className="text-xs font-bold text-brand-text-muted">Dự báo</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dynamicRevenueData}>
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
                    formatter={(value, name) => [`${value}k`, name]}
                  />
                  <Area 
                    name="Thực tế"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#E65100" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    name="Dự báo"
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
              <p className="text-orange-100 text-sm leading-relaxed">Đỉnh điểm đơn hàng diễn ra lúc {orderTrends.peakHourStr} hàng ngày, chiếm {orderTrends.peakPercentage}% tổng lượng đơn.</p>
            </div>
            
            <div className="mt-8 space-y-6 relative z-10">
              {[
                { label: "HÔM NAY", value: `${orderTrends.todayCount} ĐƠN`, color: "bg-green-400", pct: (orderTrends.todayCount / orderTrends.maxVal) * 100 },
                { label: "HÔM QUA", value: `${orderTrends.yesterdayCount} ĐƠN`, color: "bg-orange-300", pct: (orderTrends.yesterdayCount / orderTrends.maxVal) * 100 },
                { label: "TRUNG BÌNH TUẦN", value: `${orderTrends.avgWeek} ĐƠN`, color: "bg-orange-400", pct: (orderTrends.avgWeek / orderTrends.maxVal) * 100 },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black tracking-widest opacity-80 uppercase">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.pct}%` }}></div>
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
          <div className="bg-brand-surface p-8 rounded-[32px] shadow-sm border border-brand-border">
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
              {dynamicTopRestaurants.map((res, i) => (
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
                    <p className="text-xs text-brand-text-muted">{res.category}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-yellow-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-bold ml-1">{res.rating}</span>
                      </div>
                      <span className="text-[10px] text-brand-text-muted">{res.reviews} đơn</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-brand-text-muted uppercase">DOANH THU</div>
                    <div className="font-black text-brand-primary">{res.revenue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Dishes */}
          <div className="bg-brand-surface p-8 rounded-[32px] shadow-sm border border-brand-border">
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
              {dynamicTopDishes.map((dish, i) => (
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
                    <p className="text-xs text-brand-text-muted">{dish.description}</p>
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
