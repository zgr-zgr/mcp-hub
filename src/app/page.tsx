// ====================================================
// MCPHub 首页 — Hero + 搜索 + 分类导航 + 精选推荐
// ====================================================

import Link from "next/link";
import { ArrowRight, Zap, BookOpen, TrendingUp, Sparkles } from "lucide-react";
import { getServers, getTemplates, getCategoryCounts } from "@/lib/data";
import { CATEGORY_LABELS, TEMPLATE_CATEGORY_LABELS } from "@/lib/types";
import type { McpCategory, TemplateCategory } from "@/lib/types";
import ServerCard from "@/components/ServerCard";
import TemplateCard from "@/components/TemplateCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 并行获取数据
  const [featuredServers, popularTemplates, categoryCounts] = await Promise.all([
    getServers({ featured: true, limit: 6 }),
    getTemplates({ limit: 6 }),
    getCategoryCounts(),
  ]);

  return (
    <div>
      {/* ======== Hero 区域 ======== */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 py-20 relative">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
              <Sparkles size={12} /> MCP 生态一站式平台
            </span>

            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              发现最好的{" "}
              <span className="gradient-text">MCP Server</span>
              <br />
              和 AI Agent 工作流模板
            </h1>

            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
              收录上百个 Model Context Protocol Server，提供实战 Prompt 模板。
              让 AI Agent 真正能干活的「工具超市」。
            </p>

            {/* 搜索栏 */}
            <SearchBar />

            {/* 快捷入口 */}
            <div className="flex items-center justify-center gap-3 mt-6 text-sm">
              <Link
                href="/servers"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <Zap size={14} /> 浏览全部 Server
              </Link>
              <Link
                href="/templates"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <BookOpen size={14} /> 查看模板市场
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======== Server 分类导航 ======== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-400" />
            Server 分类浏览
          </h2>
          <Link
            href="/servers"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            全部 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.keys(CATEGORY_LABELS) as McpCategory[]).map((cat) => (
            <Link
              key={cat}
              href={`/servers?category=${cat}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50
                         hover:border-blue-500/50 hover:bg-slate-800 transition-all group"
            >
              <span className="text-2xl">{CATEGORY_LABELS[cat].split(" ")[0]}</span>
              <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors text-center">
                {CATEGORY_LABELS[cat].split(" ").slice(1).join(" ")}
              </span>
              {categoryCounts[cat] > 0 && (
                <span className="text-[10px] text-slate-600">{categoryCounts[cat]} 个</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ======== 精选 Server ======== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            精选 MCP Server
          </h2>
          <Link
            href="/servers"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      </section>

      {/* ======== 热门模板 ======== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-green-400" />
            热门工作流模板
          </h2>
          <Link
            href="/templates"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            查看全部 <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              让你的 AI Agent 真正能干活的工具超市
            </h2>
            <p className="text-slate-400 mb-6 max-w-lg mx-auto">
              我们会持续收录 GitHub 上最新的 MCP Server，并提供实战验证的 Prompt 模板。让每个人都能轻松构建强大的 AI Agent。
            </p>
            <Link
              href="/servers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              开始探索 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
