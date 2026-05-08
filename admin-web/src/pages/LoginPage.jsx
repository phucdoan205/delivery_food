import React from "react";
import { UtensilsCrossed, Mail, Lock, Eye, ArrowRight } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="flex w-full max-w-6xl h-[800px] bg-white rounded-[40px] overflow-hidden shadow-premium animate-in zoom-in-95 duration-700">
      {/* Left Side: Image & Glass Card */}
      <div className="hidden lg:block w-3/5 relative">
        <img 
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&fit=crop" 
          alt="Food Background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 p-10 glass rounded-[32px] border border-white/40 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-premium mb-6">
            <UtensilsCrossed size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-brand-text mb-4">Culinary Curator</h2>
          <p className="text-brand-text-muted leading-relaxed mb-6">
            Nâng tầm trải nghiệm ẩm thực số hóa qua hệ thống quản trị thông minh.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-brand-primary/30"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-brand-primary uppercase">Hệ thống quản trị ADMIN</span>
            <div className="h-px w-8 bg-brand-primary/30"></div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-2/5 p-16 flex flex-col justify-center bg-[#FFF9F7]">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-brand-text mb-3">Hệ thống Quản trị</h1>
          <h2 className="text-3xl font-bold text-brand-primary mb-6">Culinary Curator</h2>
          <p className="text-slate-500">Vui lòng đăng nhập để quản lý nền tảng của bạn.</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email hoặc Tên đăng nhập</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                <Mail size={18} />
              </div>
              <input 
                type="text" 
                placeholder="admin@culinarycurator.com" 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-200 outline-none text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</label>
              <button type="button" className="text-xs font-bold text-brand-primary hover:underline">Quên mật khẩu?</button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                className="w-full pl-12 pr-12 py-4 bg-white border border-slate-100 rounded-2xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/5 transition-all duration-200 outline-none text-sm shadow-sm"
              />
              <button type="button" className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-brand-primary">
                <Eye size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-1">
            <input type="checkbox" id="remember" className="w-5 h-5 rounded-md border-slate-200 text-brand-primary focus:ring-brand-primary/20" />
            <label htmlFor="remember" className="text-sm text-slate-500 font-medium">Ghi nhớ đăng nhập</label>
          </div>

          <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-8">
            Đăng nhập vào Bảng điều khiển
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-16 text-center">
          <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
            © 2024 Culinary Curator Admin Console. Bảo mật bởi chuẩn mã hóa 256-bit.
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <button className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline">Trung tâm trợ giúp</button>
            <button className="text-[10px] font-bold text-brand-primary uppercase tracking-widest hover:underline">Quy định bảo mật</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
