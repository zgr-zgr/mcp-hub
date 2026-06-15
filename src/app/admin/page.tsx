// ====================================================
// 管理后台 — 简易的内容管理页面
// 本阶段为静态展示，后续可接入 Supabase Auth 实现登录
// ====================================================

import { getServers, getTemplates } from "@/lib/data";
import Link from "next/link";

export const dynamic = "force-static";

export default async function AdminPage() {
  const [servers, templates] = await Promise.all([getServers(), getTemplates()]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">管理后台</h1>
      <p className="text-slate-400 text-sm mb-8">
        当前共 {servers.length} 个 Server、{templates.length} 个模板
      </p>

      {/* Server 管理 */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            📦 MCP Server ({servers.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">名称</th>
                <th className="py-3 px-4 font-medium">分类</th>
                <th className="py-3 px-4 font-medium">Stars</th>
                <th className="py-3 px-4 font-medium">精选</th>
                <th className="py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {servers.map((s) => (
                <tr key={s.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <Link href={`/servers/${s.name}`} className="text-blue-400 hover:text-blue-300">
                      {s.display_name}
                    </Link>
                    <p className="text-xs text-slate-500">{s.name}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{s.category}</td>
                  <td className="py-3 px-4 text-slate-400">{s.stars}</td>
                  <td className="py-3 px-4">
                    {s.featured ? (
                      <span className="text-amber-400">⭐ 精选</span>
                    ) : (
                      <span className="text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/servers/${s.name}`}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 模板管理 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            📋 模板 ({templates.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">标题</th>
                <th className="py-3 px-4 font-medium">分类</th>
                <th className="py-3 px-4 font-medium">下载</th>
                <th className="py-3 px-4 font-medium">价格</th>
                <th className="py-3 px-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((t) => (
                <tr key={t.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <Link href={`/templates/${t.id}`} className="text-blue-400 hover:text-blue-300">
                      {t.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{t.category}</td>
                  <td className="py-3 px-4 text-slate-400">{t.downloads}</td>
                  <td className="py-3 px-4">
                    {t.is_free ? (
                      <span className="text-green-400">免费</span>
                    ) : (
                      <span className="text-amber-400">¥{t.price}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/templates/${t.id}`}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      查看
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
