// ====================================================
// MCP Server 列表页 — 支持搜索 + 分类筛选
// ====================================================

import Link from "next/link";
import { getServers } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import type { McpCategory } from "@/lib/types";
import ServerCard from "@/components/ServerCard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ServersPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category as McpCategory | undefined;

  // 验证分类有效性
  const validCategory =
    category && Object.keys(CATEGORY_LABELS).includes(category)
      ? category
      : undefined;

  const servers = await getServers({
    search: search || undefined,
    category: validCategory,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {search
            ? `搜索结果: "${search}"`
            : validCategory
              ? CATEGORY_LABELS[validCategory]
              : "所有 MCP Server"}
        </h1>
        <p className="text-slate-400 text-sm">
          {search || validCategory ? (
            <Link href="/servers" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← 返回全部列表
            </Link>
          ) : (
            `共收录 ${servers.length} 个 MCP Server，持续更新中`
          )}
        </p>
      </div>

      {/* 分类标签栏 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/servers"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !validCategory
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          全部
        </Link>
        {(Object.keys(CATEGORY_LABELS) as McpCategory[]).map((cat) => (
          <Link
            key={cat}
            href={`/servers?category=${cat}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              validCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {/* Server 列表 */}
      {servers.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-2">😕 没有找到匹配的 Server</p>
          <p className="text-slate-500 text-sm">尝试更换搜索关键词或分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      )}
    </div>
  );
}
