// ====================================================
// 模板详情页 — 完整工作流内容 + 所需 Server 清单
// ====================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import { getTemplateById } from "@/lib/data";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/types";
import { Download, Lock, ArrowLeft, ExternalLink, CheckCircle, Copy } from "lucide-react";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TemplateDetailPage({ params }: Props) {
  const { id } = await params;
  const template = await getTemplateById(id);

  if (!template) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 面包屑 */}
      <Link
        href="/templates"
        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-6"
      >
        <ArrowLeft size={14} /> 返回模板市场
      </Link>

      {/* 头部 */}
      <div className="gradient-card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="min-w-0">
            <span className="text-xs text-slate-500 mb-1 block">
              {TEMPLATE_CATEGORY_LABELS[template.category]}
            </span>
            <h1 className="text-2xl font-bold text-slate-100">{template.title}</h1>
            <p className="text-slate-400 mt-2">{template.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {template.is_free ? (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                <CheckCircle size={14} /> 免费
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium">
                <Lock size={14} /> ¥{template.price}
              </span>
            )}
            <span className="text-sm text-slate-500">
              <Download size={14} className="inline mr-1" />
              {template.downloads} 次下载
            </span>
          </div>
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {template.tags.split(",").map((tag) => (
            <span key={tag} className="tag">{tag.trim()}</span>
          ))}
        </div>
      </div>

      {/* 所需 Server */}
      <div className="gradient-card p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          🔌 所需 MCP Server
        </h2>
        <div className="flex flex-wrap gap-2">
          {template.required_servers.split(",").map((s) => (
            <Link
              key={s}
              href={`/servers/${s.trim()}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-blue-500/10 text-blue-400 border border-blue-500/20
                         hover:bg-blue-500/20 transition-colors text-sm"
            >
              {s.trim()} <ExternalLink size={12} />
            </Link>
          ))}
        </div>
      </div>

      {/* 使用场景 */}
      <div className="gradient-card p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-3">
          🎯 适用场景
        </h2>
        <p className="text-slate-300">{template.use_case}</p>
      </div>

      {/* 工作流内容（Markdown 渲染） */}
      <div className="gradient-card p-6 mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          📋 工作流内容
        </h2>
        <div
          className="prose-custom text-slate-300"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(template.content) }}
        />
      </div>

      {/* 一键复制 */}
      <div className="relative">
        <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono max-h-96 overflow-y-auto">
          <code>{template.content}</code>
        </pre>
        <CopyButton text={template.content} />
      </div>

      {/* 作者信息 */}
      <p className="text-xs text-slate-600 mt-6 text-center">
        由 {template.author} 发布 · 最后更新 {template.updated_at}
      </p>
    </div>
  );
}

/** 简陋的 Markdown → HTML 渲染（生产环境建议用 react-markdown） */
function renderMarkdown(md: string): string {
  let html = md
    // 标题
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // 粗体
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // 行内代码
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // 无序列表
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // 有序列表
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // 段落
    .replace(/^(?!<[hcl]|$)(.+)$/gm, "<p>$1</p>")
    // 换行
    .replace(/\n\n/g, "</p><p>");

  // 包裹相邻的 <li>
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, "<ul>$&</ul>");

  return html;
}
