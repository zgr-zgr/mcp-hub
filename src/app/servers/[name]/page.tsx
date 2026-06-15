// ====================================================
// MCP Server 详情页 — 介绍 / 安装 / AI 评测
// ====================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerByName, getReviews } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { Star, ExternalLink, Terminal, ArrowLeft, Download } from "lucide-react";
import { serverCategoryIcon } from "@/components/ServerCard";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function ServerDetailPage({ params }: Props) {
  const { name } = await params;
  const server = await getServerByName(name);

  if (!server) notFound();

  const reviews = await getReviews(server.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 面包屑 */}
      <Link
        href="/servers"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-6"
      >
        <ArrowLeft size={14} /> 返回 Server 列表
      </Link>

      {/* 头部信息 */}
      <div className="gradient-card p-6 mb-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{serverCategoryIcon(server.category)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-slate-100">{server.display_name}</h1>
              {server.featured && (
                <span className="tag text-amber-300 bg-amber-400/10 border-amber-400/20">精选</span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-mono mb-2">{server.name}</p>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-amber-400" />
                {server.stars.toLocaleString()} stars
              </span>
              <span>{CATEGORY_LABELS[server.category]}</span>
              <span>@{server.author}</span>
              {server.license && <span className="text-slate-600">{server.license}</span>}
            </div>
          </div>
        </div>

        <p className="mt-4 text-slate-300">{server.description}</p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {server.tags.split(",").map((tag) => (
            <span key={tag} className="tag">{tag.trim()}</span>
          ))}
        </div>
      </div>

      {/* 安装命令 */}
      <div className="gradient-card p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          <Terminal size={18} className="text-green-400" />
          安装命令
        </h2>
        <div className="relative">
          <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono">
            <code>{server.install_command}</code>
          </pre>
          <CopyButton text={server.install_command} />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          传输方式: <code className="text-blue-400">{server.transport}</code>
        </p>
      </div>

      {/* AI 评测摘要 */}
      {server.ai_summary && (
        <div className="gradient-card p-6 mb-6 border-blue-500/20">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
            🤖 AI 评测摘要
          </h2>
          <p className="text-slate-300 leading-relaxed">{server.ai_summary}</p>
        </div>
      )}

      {/* 链接 */}
      <div className="flex flex-wrap gap-3 mb-6">
        <a
          href={server.repo_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm"
        >
          <ExternalLink size={14} /> GitHub 仓库
        </a>
        {server.docs_url && (
          <a
            href={server.docs_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-sm"
          >
            <Download size={14} /> 官方文档
          </a>
        )}
      </div>
    </div>
  );
}


