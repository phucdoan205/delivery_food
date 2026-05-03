import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Section Center: Hero & Counter */}
      <section
        id="center"
        className="flex flex-col items-center justify-center py-20 gap-8"
      >
        <div className="hero relative flex justify-center items-center h-40 w-40">
          {/* Các logo chuyển động nhẹ bằng Tailwind */}
          <img
            src={viteLogo}
            className="absolute w-24 h-24 animate-bounce"
            alt="Vite logo"
          />
          <img
            src={reactLogo}
            className="absolute w-12 h-12 bottom-0 right-0 animate-spin-slow"
            alt="React logo"
          />
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            Văn Phúc đẹp zai
          </h1>
          <p className="mt-4 text-slate-500">
            Chỉnh sửa{" "}
            <code className="bg-slate-100 px-1 rounded text-pink-500">
              src/App.jsx
            </code>{" "}
            để test tính năng HMR.
          </p>
        </div>

        <button
          type="button"
          className="counter bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-blue-200"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {/* Đường kẻ ngăn cách dùng Tailwind v4 */}
      <div className="border-t border-slate-100 w-full"></div>

      {/* Section Next Steps: Tài liệu & Cộng đồng */}
      <section
        id="next-steps"
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 p-10"
      >
        {/* Cột Documentation */}
        <div id="docs" className="space-y-4">
          <div className="text-3xl">📚</div>
          <h2 className="text-2xl font-bold">Documentation</h2>
          <p className="text-slate-500">
            Mọi câu hỏi của bạn đều có lời giải tại đây.
          </p>
          <div className="flex gap-4 pt-2">
            <a
              href="https://vite.dev/"
              target="_blank"
              className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <img className="w-5" src={viteLogo} alt="" />
              Vite Docs
            </a>
            <a
              href="https://react.dev/"
              target="_blank"
              className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-lg hover:bg-cyan-50 transition-colors"
            >
              <img className="w-5" src={reactLogo} alt="" />
              React Docs
            </a>
          </div>
        </div>

        {/* Cột Social */}
        <div id="social" className="space-y-4">
          <div className="text-3xl">🌐</div>
          <h2 className="text-2xl font-bold">Connect</h2>
          <p className="text-slate-500">
            Tham gia cộng đồng Vite & React toàn cầu.
          </p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <a
                href="https://github.com"
                className="text-sm font-medium hover:text-blue-600 underline decoration-slate-200"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://chat.vite.dev"
                className="text-sm font-medium hover:text-blue-600 underline decoration-slate-200"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                className="text-sm font-medium hover:text-blue-600 underline decoration-slate-200"
              >
                X.com
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section id="spacer" className="h-20"></section>
    </div>
  );
}

export default App;
