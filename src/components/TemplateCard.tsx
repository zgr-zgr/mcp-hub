// ====================================================
// TemplateCard — 模板卡片组件
// ====================================================

import Link from "next/link";
import { Download, ArrowRight, Lock } from "lucide-react";
import type { Template } from "@/lib/types";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/types";

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link
      href={`/templates/${template.id}`}
      className="gradient-card p-5 flex flex-col h-full group relative"
    >
      {/* 付费标记 */}
      {!template.is_free && (
        <span className="absolute top-3 right-3 tag text-amber-300 bg-amber-400/10 border-amber-400/20">
          <Lock size={10} className="mr-1" /> ¥{template.price}
        </span>
      )}

      {/* 分类标签 */}
      <span className="text-xs text-slate-500 mb-2">
        {TEMPLATE_CATEGORY_LABELS[template.category]}
      </span>

      {/* 标题 */}
      <h3 className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors mb-2">
        {template.title}
      </h3>

      {/* 描述 */}
      <p className="text-sm text-slate-400 mb-3 flex-1 line-clamp-2">{template.description}</p>

      {/* 所需 Server */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {template.required_servers.split(",").map(s => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {s.trim()}
          </span>
        ))}
      </div>

      {/* 底部 */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800">
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Download size={12} />
          {template.downloads} 次下载
        </span>
        <span className="flex items-center gap-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
          查看 <ArrowRight size={12} />
        </span>
      </div>
    </Link>
  );
}
