// ====================================================
// Supabase 客户端 — 用于连接数据库和认证
// ====================================================
// 使用方法:
//   1. 在 https://supabase.com 注册免费账号
//   2. 创建项目 → Settings → API → 复制 URL 和 anon key
//   3. 创建 .env.local 文件:
//      NEXT_PUBLIC_SUPABASE_URL=https://xxxxxx.supabase.co
//      NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
//
//   不配置也可运行 — 自动使用内置模拟数据
// ====================================================

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** 检查是否已配置 Supabase */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key);
}

// 懒初始化 — 只在环境变量完整时才创建客户端
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}

/** 获取 Supabase 客户端（未配置时返回 null，data.ts 会自动降级到模拟数据） */
export function supabase(): SupabaseClient | null {
  return getClient();
}
