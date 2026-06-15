// ====================================================
// 模板市场列表页
// ====================================================

import Link from "next/link";
import { getTemplates } from "@/lib/data";
import { TEMPLATE_CATEGORY_LABELS } from "@/lib/types";
import type { TemplateCategory } from "@/lib/types";
import TemplateCard from "@/components/TemplateCard";

export const dynamic = "force-static";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function TemplatesPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category as TemplateCategory | undefined;

  const validCategory =
    category && Object.keys(TEMPLATE_CATEGORY_LABELS).includes(category)
      ? category
      : undefined;

  const templates = await getTemplates({
    search: search || undefined,
    category: validCategory,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          {search ? `搜索结果: "${search}"` : "工作流模板市场"}
        </h1>
        <p className="text-slate-400 text-sm">
          {search || validCategory ? (
            <Link href="/templates" className="text-blue-400 hover:text-blue-300 transition-colors">
              ← 返回全部模板
            </Link>
          ) : (
            `共收录 ${templates.length} 个实战模板，持续更新中`
          )}
        </p>
      </div>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/templates"
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            !validCategory
              ? "bg-blue-600 text-white"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          全部
        </Link>
        {(Object.keys(TEMPLATE_CATEGORY_LABELS) as TemplateCategory[]).map((cat) => (
          <Link
            key={cat}
            href={`/templates?category=${cat}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              validCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
            }`}
          >
            {TEMPLATE_CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      {/* 模板列表 */}
      {templates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-400 text-lg mb-2">😕 没有找到匹配的模板</p>
          <p className="text-slate-500 text-sm">尝试更换搜索关键词或分类</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}
