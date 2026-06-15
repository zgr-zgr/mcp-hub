// ====================================================
// ServerCard — MCP Server 卡片组件
// 用于首页推荐、列表页展示
// ====================================================

import Link from "next/link";
import { Star, Download, ArrowRight } from "lucide-react";
import type { McpServer } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

interface ServerCardProps {
  server: McpServer;
  /** 是否显示为紧凑模式（仅名称+描述） */
  compact?: boolean;
}

export default function ServerCard({ server, compact = false }: ServerCardProps) {
  if (compact) {
    return (
      <Link
        href={`/servers/${server.name}`}
        className="gradient-card p-4 flex items-start gap-3 group"
      >
        <span className="text-2xl shrink-0 mt-0.5">
          {serverCategoryIcon(server.category)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-100 truncate group-hover:text-blue-400 transition-colors">
            {server.display_name}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{server.description}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Star size={12} className="text-amber-400" />
              {formatNumber(server.stars)}
            </span>
            <span>{CATEGORY_LABELS[server.category]}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/servers/${server.name}`}
      className="gradient-card p-5 flex flex-col h-full group"
    >
      {/* 头部 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{serverCategoryIcon(server.category)}</span>
          <div>
            <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors">
              {server.display_name}
            </h3>
            <p className="text-xs text-slate-500 font-mono">{server.name}</p>
          </div>
        </div>
        {server.featured && (
          <span className="tag text-amber-300 bg-amber-400/10 border-amber-400/20">精选</span>
        )}
      </div>

      {/* 描述 */}
      <p className="text-sm text-slate-400 mb-3 flex-1 line-clamp-2">{server.description}</p>

      {/* AI 摘要 */}
      {server.ai_summary && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 italic">
          💡 {server.ai_summary}
        </p>
      )}

      {/* 底部信息 */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={12} className="text-amber-400" />
            {formatNumber(server.stars)}
          </span>
          <span>{CATEGORY_LABELS[server.category]}</span>
        </div>
        <span className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          详情 <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}

/** 分类图标 */
export function serverCategoryIcon(category: string): string {
  const map: Record<string, string> = {
    browser: "🌐",
    filesystem: "📁",
    database: "🗄️",
    api: "🔌",
    "dev-tools": "🛠️",
    cloud: "☁️",
    ai: "🤖",
    security: "🔒",
    communication: "💬",
    other: "📦",
  };
  return map[category] || "📦";
}

/** 格式化数字（如 5100 → 5.1k） */
function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}
