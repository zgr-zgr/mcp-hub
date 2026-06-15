// 404 页面
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="text-center">
        <p className="text-6xl mb-4">🔌</p>
        <h1 className="text-3xl font-bold mb-2">404 — 页面未找到</h1>
        <p className="text-slate-400 mb-6">你找的 MCP Server 或模板可能已经被下架了</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/servers"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            浏览 Server
          </Link>
        </div>
      </div>
    </div>
  );
}
