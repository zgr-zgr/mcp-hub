"use client";

// ====================================================
// SearchBar — 搜索组件（客户端交互）
// ====================================================

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/servers?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索 MCP Server，如 puppeteer、github、postgres..."
          className="w-full pl-11 pr-28 py-3.5 bg-slate-800 border border-slate-700 rounded-xl
                     text-slate-200 placeholder:text-slate-500
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                     transition-all text-sm"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5
                     bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium
                     rounded-lg transition-colors"
        >
          搜索
        </button>
      </div>
    </form>
  );
}
