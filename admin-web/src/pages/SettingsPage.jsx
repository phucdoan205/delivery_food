import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { 
  Bell, 
  Box, 
  Lock, 
  FileText, 
  LogOut, 
  ChevronRight, 
  ExternalLink, 
  Languages, 
  Moon,
  Globe,
  Share2,
  CheckCircle,
  ArrowLeft,
  Scale,
  ShieldCheck,
  Store
} from "lucide-react";

const SettingsPage = () => {
  const [activeView, setActiveView] = useState("main"); // 'main' or 'change-password'
  
  // Toggles state
  const [darkMode, setDarkMode] = useState(false);
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifRevenue, setNotifRevenue] = useState(true);
  const [notifSecurity, setNotifSecurity] = useState(false);

  if (activeView === "change-password") {
    return (
      <AdminLayout title="Đổi mật khẩu">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setActiveView("main")}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-brand-text">Đổi mật khẩu</h2>
              <p className="text-sm text-slate-400">Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.</p>
            </div>
          </div>

          <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu hiện tại" 
                className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Mật khẩu mới</label>
              <input 
                type="password" 
                placeholder="Nhập mật khẩu mới" 
                className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" 
              />
              <p className="text-[10px] text-slate-400 ml-1">Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Xác nhận mật khẩu mới</label>
              <input 
                type="password" 
                placeholder="Nhập lại mật khẩu mới" 
                className="w-full px-4 py-3 bg-brand-bg border-transparent rounded-2xl text-sm font-medium focus:ring-brand-primary/20 transition-all" 
              />
            </div>

            <div className="pt-6 border-t border-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setActiveView("main")}
                className="px-6 py-3 bg-brand-bg text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all"
              >
                Hủy bỏ
              </button>
              <button className="px-8 py-3 bg-brand-primary text-white rounded-2xl text-sm font-bold shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all">
                Lưu mật khẩu
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (activeView === "terms") {
    return (
      <AdminLayout title="Điều khoản">
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
          {/* Header area with back button */}
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setActiveView("main")}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <ArrowLeft size={24} className="text-slate-600" />
            </button>
            <div>
              <h2 className="text-2xl font-black text-brand-text">Cài đặt hệ thống</h2>
              <p className="text-sm text-slate-400">Quay lại</p>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-[#FFF5F2] rounded-[32px] p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-[#FFEBE5] rounded-full flex items-center justify-center mb-6 text-[#A04F2D]">
              <Scale size={40} />
            </div>
            <div className="text-[10px] font-black text-[#8C6B5D] uppercase tracking-widest mb-2">PHÁP LÝ & QUY ĐỊNH</div>
            <h1 className="text-4xl font-black text-[#5C3D2E] mb-3">Cam kết Vận hành Minh bạch</h1>
            <p className="text-sm font-medium text-[#8C6B5D]">Cập nhật lần cuối: Tháng 10, 2023</p>
          </div>

          {/* Content Body */}
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-slate-50 space-y-12">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F2] text-[#A04F2D] flex items-center justify-center font-black text-sm">1</div>
                <h3 className="text-xl font-black text-[#5C3D2E]">Giới thiệu</h3>
              </div>
              <p className="text-[#8C6B5D] leading-relaxed mb-6">
                Chào mừng bạn đến với hệ thống quản trị của chúng tôi. Bằng cách sử dụng ứng dụng này, bạn đồng ý tuân thủ các quy tắc và hướng dẫn vận hành được thiết lập để đảm bảo chất lượng dịch vụ ẩm thực tốt nhất cho người dùng.
              </p>
              <div className="bg-[#FFF5F2] border-l-4 border-[#A04F2D] p-6 rounded-r-2xl italic text-[#5C3D2E] font-medium leading-relaxed">
                "Mục tiêu của chúng tôi là tạo ra một hệ sinh thái ẩm thực kết nối giữa nhà hàng, tài xế và khách hàng một cách liền mạch."
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-[#FFF5F2] text-[#A04F2D] flex items-center justify-center font-black text-sm">2</div>
                <h3 className="text-xl font-black text-[#5C3D2E]">Quyền và trách nhiệm</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#FFF5F2] p-8 rounded-3xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#2E7D32] mb-4">
                    <ShieldCheck size={20} />
                  </div>
                  <h4 className="text-base font-bold text-[#5C3D2E] mb-3">Đối với Admin</h4>
                  <p className="text-sm text-[#8C6B5D] leading-relaxed">
                    Đảm bảo tính chính xác của dữ liệu nhà hàng và trạng thái đơn hàng thời gian thực.
                  </p>
                </div>
                <div className="bg-[#FFF5F2] p-8 rounded-3xl">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#A04F2D] mb-4">
                    <Store size={20} />
                  </div>
                  <h4 className="text-base font-bold text-[#5C3D2E] mb-3">Đối với Đối tác</h4>
                  <p className="text-sm text-[#8C6B5D] leading-relaxed">
                    Cung cấp thông tin thực đơn chính xác và cập nhật giá cả minh bạch trên nền tảng.
                  </p>
                </div>
              </div>

              <div className="bg-[#FFEBE5] p-6 rounded-2xl text-[#D9534F] text-sm leading-relaxed">
                <span className="font-bold">Lưu ý:</span> Mọi hành vi gian lận dữ liệu hoặc cố tình làm sai lệch thông tin đơn hàng sẽ bị đình chỉ tài khoản quản trị ngay lập tức mà không cần báo trước.
              </div>
            </div>

          </div>
        </div>
      </AdminLayout>
    );
  }

  // Main Settings View
  return (
    <AdminLayout title="Cài đặt hệ thống">
      <div className="max-w-5xl space-y-8">
        <div>
          <h2 className="text-3xl font-black text-[#5C3D2E] mb-2">Cài đặt hệ thống</h2>
          <p className="text-sm text-[#8C6B5D]">Tùy chỉnh và quản lý cấu hình vận hành của bạn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Ngôn ngữ & Hiển thị - Col span 2 */}
          <div className="md:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-slate-50">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h3 className="text-lg font-bold text-[#5C3D2E] mb-1">Ngôn ngữ & Hiển thị</h3>
                <p className="text-xs text-[#8C6B5D]">Điều chỉnh giao diện người dùng</p>
              </div>
              <Languages className="text-[#D98C72]" size={24} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between bg-[#FFF5F2] p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Globe className="text-[#5C3D2E]" size={20} />
                  <div>
                    <div className="text-[10px] font-bold text-[#8C6B5D] uppercase">Ngôn ngữ ứng dụng</div>
                    <div className="text-sm font-bold text-[#D9534F]">Tiếng Việt</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#FFF5F2] p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Moon className="text-[#5C3D2E]" size={20} />
                  <div className="text-sm font-bold text-[#5C3D2E]">Chế độ tối</div>
                </div>
                {/* Toggle switch */}
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-brand-primary' : 'bg-[#FFCCBC]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Build Info - Col span 1 */}
          <div className="bg-[#FF7A50] rounded-[32px] p-8 text-white flex flex-col items-center justify-center text-center shadow-premium relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-8 -mb-8"></div>
            <Box size={40} className="mb-4 relative z-10" />
            <h3 className="text-2xl font-black mb-1 relative z-10">Build 1.2.0</h3>
            <p className="text-white/80 text-sm font-medium relative z-10">Phiên bản ổn định</p>
          </div>

          {/* Thông báo - Col span 2 */}
          <div className="md:col-span-2 bg-[#FFF5F2] rounded-[32px] p-8">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="text-[#D98C72]" size={24} />
              <h3 className="text-lg font-bold text-[#5C3D2E]">Thông báo</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#5C3D2E]">Thông báo đơn hàng</span>
                <button 
                  onClick={() => setNotifOrder(!notifOrder)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifOrder ? 'bg-[#2E7D32]' : 'bg-[#FFCCBC]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notifOrder ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#5C3D2E]">Báo cáo doanh thu</span>
                <button 
                  onClick={() => setNotifRevenue(!notifRevenue)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifRevenue ? 'bg-[#2E7D32]' : 'bg-[#FFCCBC]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notifRevenue ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#5C3D2E]">Cảnh báo bảo mật</span>
                <button 
                  onClick={() => setNotifSecurity(!notifSecurity)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${notifSecurity ? 'bg-[#FFCCBC]' : 'bg-[#FFCCBC]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${notifSecurity ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Tích hợp API - Col span 1 */}
          <div className="bg-[#FFEBE5] rounded-[32px] p-8 relative overflow-hidden">
            <Share2 size={120} className="absolute -right-10 -bottom-10 text-[#FFD6C9] opacity-50 rotate-12" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-[#5C3D2E] mb-2">Tích hợp API</h3>
              <p className="text-xs text-[#8C6B5D] mb-6 leading-relaxed">
                Quản lý các cổng thanh toán, đơn vị vận chuyển bên thứ ba và các dịch vụ webhook.
              </p>
              <button className="px-5 py-2.5 bg-[#4A3228] text-white rounded-xl text-xs font-bold hover:bg-[#3A271E] transition-all">
                Cấu hình Webhooks
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <button 
            onClick={() => setActiveView("change-password")}
            className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <Lock className="text-[#8C6B5D]" size={20} />
              <span className="text-sm font-bold text-[#5C3D2E]">Đổi mật khẩu</span>
            </div>
            <ChevronRight className="text-[#8C6B5D] group-hover:translate-x-1 transition-transform" size={18} />
          </button>

          <button 
            onClick={() => setActiveView("terms")}
            className="flex items-center justify-between p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <FileText className="text-[#8C6B5D]" size={20} />
              <span className="text-sm font-bold text-[#5C3D2E]">Điều khoản dịch vụ</span>
            </div>
            <ExternalLink className="text-[#D98C72]" size={18} />
          </button>

          <button className="flex items-center justify-center gap-3 p-5 bg-[#FFEBE5] rounded-[24px] hover:bg-[#FFD6C9] transition-all group">
            <LogOut className="text-[#D32F2F] group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="text-sm font-bold text-[#D32F2F]">Đăng xuất</span>
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
