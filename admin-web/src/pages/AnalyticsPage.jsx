import React from "react";
import AdminLayout from "../layouts/AdminLayout";
import { BarChart3, TrendingUp, PieChart, Download, Calendar } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from "recharts";

const data = [
  { name: "Tháng 1", sales: 4000 },
  { name: "Tháng 2", sales: 3000 },
  { name: "Tháng 3", sales: 2000 },
  { name: "Tháng 4", sales: 2780 },
  { name: "Tháng 5", sales: 1890 },
  { name: "Tháng 6", sales: 2390 },
];

const categoryData = [
  { name: "Món Việt", value: 400 },
  { name: "Fast Food", value: 300 },
  { name: "Đồ uống", value: 300 },
  { name: "Món Á", value: 200 },
];

const COLORS = ["#E65100", "#FF9800", "#FFCCBC", "#3E2723"];

const AnalyticsPage = () => {
  return (
    <AdminLayout title="Báo cáo & Phân tích">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-brand-text">Phân tích chuyên sâu</h2>
            <p className="text-sm text-slate-400">Dữ liệu thống kê và báo cáo chi tiết về hiệu suất kinh doanh.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-500">
              <Calendar size={16} />
              01/01/2024 - 31/01/2024
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-premium transition-all">
              <Download size={18} />
              Tải báo cáo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-brand-text mb-8">Doanh thu theo tháng</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                  <Tooltip cursor={{fill: '#FFF5F2'}} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="sales" fill="#E65100" radius={[8, 8, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-brand-text mb-8">Cơ cấu ngành hàng</h3>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="space-y-4 pr-8">
                {categoryData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-xs font-bold text-slate-500">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
