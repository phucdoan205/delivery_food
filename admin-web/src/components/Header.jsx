import React from "react";
import { Search, Bell, HelpCircle, Command } from "lucide-react";

const Header = ({ title }) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-brand-text">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-primary">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm nhanh... (Ctrl-K)" 
            className="pl-10 pr-12 py-2 bg-brand-bg border-transparent focus:border-brand-primary focus:ring-0 rounded-full text-sm w-64 transition-all duration-200"
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <div className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-400">
              ⌘K
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:bg-brand-bg hover:text-brand-primary rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-brand-primary rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-slate-500 hover:bg-brand-bg hover:text-brand-primary rounded-full transition-colors">
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
