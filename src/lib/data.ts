// ====================================================
// 数据访问层 — 从 Supabase 读取，未配置时降级到模拟数据
// ====================================================

import { supabase as getSupabase, isSupabaseConfigured } from "./supabase";
import type { McpServer, Template, Review, McpCategory, TemplateCategory } from "./types";

// ====================================================
// MCP Server 相关接口
// ====================================================

/** 获取所有 Server（支持分类筛选和搜索） */
export async function getServers(options?: {
  category?: McpCategory;
  search?: string;
  featured?: boolean;
  limit?: number;
}): Promise<McpServer[]> {
  if (!isSupabaseConfigured()) {
    return getMockServers(options);
  }

  const client = getSupabase()!;
  let query = client.from("servers").select("*").order("stars", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.featured) query = query.eq("featured", true);
  if (options?.search)  query = query.or(`name.ilike.%${options.search}%,display_name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  if (options?.limit)   query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) { console.error("Error fetching servers:", error); return []; }
  return data as McpServer[];
}

/** 按名称获取单个 Server */
export async function getServerByName(name: string): Promise<McpServer | null> {
  if (!isSupabaseConfigured()) {
    const servers = getMockServers({});
    return servers.find(s => s.name === name) || null;
  }

  const client = getSupabase()!;
  const { data, error } = await client
    .from("servers")
    .select("*")
    .eq("name", name)
    .single();

  if (error) { console.error("Error fetching server:", error); return null; }
  return data as McpServer;
}

/** 增加浏览量 */
export async function incrementServerViews(name: string) {
  if (!isSupabaseConfigured()) return;
  await getSupabase()!.rpc("increment_views", { server_name: name });
}

/** 获取 Server 的分类统计（每个分类的数量） */
export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (!isSupabaseConfigured()) {
    const servers = getMockServers({});
    const counts: Record<string, number> = {};
    servers.forEach(s => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return counts;
  }

  const client = getSupabase()!;
  const { data, error } = await client
    .from("servers")
    .select("category");

  if (error) return {};
  const counts: Record<string, number> = {};
  (data as { category: string }[]).forEach(row => {
    counts[row.category] = (counts[row.category] || 0) + 1;
  });
  return counts;
}

// ====================================================
// 模板相关接口
// ====================================================

/** 获取模板列表 */
export async function getTemplates(options?: {
  category?: TemplateCategory;
  search?: string;
  limit?: number;
}): Promise<Template[]> {
  if (!isSupabaseConfigured()) {
    return getMockTemplates(options);
  }

  const client = getSupabase()!;
  let query = client.from("templates").select("*").order("downloads", { ascending: false });

  if (options?.category) query = query.eq("category", options.category);
  if (options?.search)  query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  if (options?.limit)   query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) { console.error("Error fetching templates:", error); return []; }
  return data as Template[];
}

/** 按 ID 获取单个模板 */
export async function getTemplateById(id: string): Promise<Template | null> {
  if (!isSupabaseConfigured()) {
    const templates = getMockTemplates({});
    return templates.find(t => t.id === id) || null;
  }

  const client = getSupabase()!;
  const { data, error } = await client
    .from("templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) { console.error("Error fetching template:", error); return null; }
  return data as Template;
}

// ====================================================
// 评价相关接口
// ====================================================

export async function getReviews(serverId: string): Promise<Review[]> {
  if (!isSupabaseConfigured()) return [];

  const client = getSupabase()!;
  const { data, error } = await client
    .from("reviews")
    .select("*")
    .eq("server_id", serverId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Review[];
}

// ====================================================
// 模拟数据（Supabase 未配置时的 fallback）
// 可在 Supabase 配置后删除此段
// ====================================================

function getMockServers(options?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}): McpServer[] {
  let servers: McpServer[] = MOCK_SERVERS;

  if (options?.category) servers = servers.filter(s => s.category === options.category);
  if (options?.featured)  servers = servers.filter(s => s.featured);
  if (options?.search) {
    const q = options.search.toLowerCase();
    servers = servers.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.display_name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  }
  if (options?.limit) servers = servers.slice(0, options.limit);

  return servers;
}

function getMockTemplates(options?: {
  category?: string;
  search?: string;
  limit?: number;
}): Template[] {
  let templates: Template[] = MOCK_TEMPLATES;

  if (options?.category) templates = templates.filter(t => t.category === options.category);
  if (options?.search) {
    const q = options.search.toLowerCase();
    templates = templates.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }
  if (options?.limit) templates = templates.slice(0, options.limit);

  return templates;
}

// 内嵌模拟数据 — 与 supabase-schema.sql 种子数据同步
const MOCK_SERVERS: McpServer[] = [
  {
    id: "1", name: "puppeteer", display_name: "Puppeteer",
    description: "浏览器自动化：导航、截图、点击、填表",
    category: "browser", install_command: "npx -y @modelcontextprotocol/server-puppeteer",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "浏览器,截图,自动化,测试",
    ai_summary: "让 Agent 控制真实浏览器：导航网页、截图、点击按钮、填表提交，Web 自动化的终极方案。",
    stars: 5100, views: 0, featured: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "2", name: "filesystem", display_name: "File System",
    description: "安全的文件系统操作，支持读写文件、目录浏览",
    category: "filesystem", install_command: "npx -y @modelcontextprotocol/server-filesystem /path/to/dir",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "文件,目录,读写,安全",
    ai_summary: "官方出品的基础 MCP Server，提供沙盒化的文件系统读写能力，是所有需要文件操作的 Agent 的必备工具。",
    stars: 4200, views: 0, featured: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "3", name: "github", display_name: "GitHub",
    description: "管理仓库、Issue、PR、代码搜索",
    category: "dev-tools", install_command: "npx -y @modelcontextprotocol/server-github",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "GitHub,仓库,Issue,PR,代码",
    ai_summary: "让你的 Agent 直接操作 GitHub：创建仓库、管理 Issue、发起 PR、搜索代码，开发流程全自动化。",
    stars: 3800, views: 0, featured: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "4", name: "playwright", display_name: "Playwright",
    description: "微软 Playwright 浏览器自动化",
    category: "browser", install_command: "npx -y @anthropic/mcp-server-playwright",
    transport: "stdio", repo_url: "https://github.com/anthropics/mcp-server-playwright",
    author: "Anthropic", license: "MIT",
    tags: "浏览器,Playwright,测试,自动化",
    ai_summary: "基于 Playwright 的浏览器 MCP Server，支持更精细的页面交互和测试能力。",
    stars: 3200, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "5", name: "postgres", display_name: "PostgreSQL",
    description: "PostgreSQL 数据库查询和管理",
    category: "database", install_command: "npx -y @modelcontextprotocol/server-postgres",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "数据库,SQL,PostgreSQL",
    ai_summary: "连接 PostgreSQL 数据库，允许 Agent 执行 SQL 查询、查看表结构，数据分析场景的核心工具。",
    stars: 2900, views: 0, featured: true,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "6", name: "brave-search", display_name: "Brave Search",
    description: "通过 Brave Search API 进行网络搜索",
    category: "api", install_command: "npx -y @anthropic/mcp-server-brave-search",
    transport: "stdio", repo_url: "https://github.com/anthropics/mcp-server-brave-search",
    author: "Anthropic", license: "MIT",
    tags: "搜索,网络,信息检索",
    ai_summary: "集成 Brave Search，让 Agent 能够联网获取实时信息，不再局限于训练数据。",
    stars: 2600, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "7", name: "sequential-thinking", display_name: "Sequential Thinking",
    description: "分步推理引擎，复杂问题拆解",
    category: "ai", install_command: "npx -y @modelcontextprotocol/server-sequential-thinking",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "推理,思维链,复杂问题",
    ai_summary: "提供分步推理解题能力，特别适合数学证明、逻辑分析等需要链式思考的场景。",
    stars: 2200, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "8", name: "memory", display_name: "Memory",
    description: "持久化记忆系统，跨会话知识图谱",
    category: "ai", install_command: "npx -y @modelcontextprotocol/server-memory",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "记忆,知识图谱,持久化",
    ai_summary: "为 Agent 提供长期记忆能力，基于知识图谱跨会话保存和检索信息，让智能体真正'记住'你。",
    stars: 1800, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "9", name: "slack", display_name: "Slack",
    description: "Slack 消息发送、频道管理",
    category: "communication", install_command: "npx -y @modelcontextprotocol/server-slack",
    transport: "stdio", repo_url: "https://github.com/modelcontextprotocol/servers",
    author: "Anthropic", license: "MIT",
    tags: "Slack,消息,通讯,通知",
    ai_summary: "让 Agent 连接 Slack 工作空间，自动发送通知、管理频道、处理消息。",
    stars: 1500, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "10", name: "exa", display_name: "Exa Search",
    description: "AI 语义搜索引擎，专为 LLM 设计",
    category: "api", install_command: "npx -y @anthropic/mcp-server-exa",
    transport: "stdio", repo_url: "https://github.com/anthropics/mcp-server-exa",
    author: "Anthropic", license: "MIT",
    tags: "搜索,语义,LLM,内容发现",
    ai_summary: "Exa 是专为 AI 设计的搜索引擎，语义理解而非关键词匹配，搜索结果更适合 LLM 消费。",
    stars: 1800, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "11", name: "everything", display_name: "Everything",
    description: "一站式参考 Server，聚合多个工具",
    category: "dev-tools", install_command: "npx -y @anthropic/mcp-server-everything",
    transport: "stdio", repo_url: "https://github.com/anthropics/mcp-server-everything",
    author: "Anthropic", license: "MIT",
    tags: "综合,参考,工具集",
    ai_summary: "集合了多种开发工具的参考 MCP Server，适合快速体验 MCP 的所有能力。",
    stars: 1200, views: 0, featured: false,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
];

const MOCK_TEMPLATES: Template[] = [
  {
    id: "1", title: "全栈开发助手", description: "用 AI Agent 从零搭建全栈 Web 应用",
    category: "coding", use_case: "从需求描述到可运行的 Web 应用",
    required_servers: "github,filesystem,postgres",
    content: "## 工作流\n1. 分析用户需求\n2. 创建项目文件\n3. 初始化 Git 仓库\n4. 设计数据库\n5. 提交代码",
    author: "MCPHub", tags: "全栈,Web,开发,入门",
    is_free: true, downloads: 128,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "2", title: "每日新闻简报生成器", description: "自动抓取新闻 → AI 总结 → 发送到 Slack",
    category: "automation", use_case: "每天早上自动推送新闻摘要",
    required_servers: "brave-search,slack",
    content: "## 工作流\n1. 搜索今日新闻\n2. AI 总结为简报\n3. 发送到 Slack 频道",
    author: "MCPHub", tags: "新闻,自动化,Slack,日报",
    is_free: true, downloads: 86,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "3", title: "代码审查助手", description: "AI 自动审查 PR 代码质量 + 安全漏洞",
    category: "coding", use_case: "每次 PR 提交自动触发审查",
    required_servers: "github,puppeteer",
    content: "## 工作流\n1. 监控新 PR\n2. 拉取代码 diff\n3. AI 分析代码质量\n4. 发表审查评论",
    author: "MCPHub", tags: "代码审查,自动化,PR,安全",
    is_free: true, downloads: 203,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "4", title: "学术研究助手", description: "联网搜索文献 → 阅读总结 → 生成综述",
    category: "research", use_case: "快速完成文献综述和资料整理",
    required_servers: "brave-search,filesystem,sequential-thinking",
    content: "## 工作流\n1. 搜索学术文献\n2. 分步分析\n3. 生成结构化综述",
    author: "MCPHub", tags: "学术,研究,文献,综述",
    is_free: true, downloads: 67,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "5", title: "网页数据采集器", description: "自动浏览网页 → 提取数据 → 存入数据库",
    category: "data", use_case: "竞品分析、数据采集、舆情监控",
    required_servers: "puppeteer,postgres",
    content: "## 工作流\n1. 打开目标网页\n2. 提取数据字段\n3. 清洗结构化\n4. 写入数据库",
    author: "MCPHub", tags: "爬虫,数据采集,竞品分析",
    is_free: true, downloads: 91,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "6", title: "日报周报自动生成", description: "根据 Git 提交记录自动生成工作日报/周报",
    category: "automation", use_case: "程序员日报周报自动生成",
    required_servers: "github",
    content: "## 工作流\n1. 拉取 Git 提交记录\n2. AI 分析代码变更\n3. 生成结构化日报\n## Prompt\n请根据我的 Git 提交记录生成今日工作日报…",
    author: "MCPHub", tags: "日报,周报,自动化,Git",
    is_free: true, downloads: 312,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "7", title: "竞品监控仪表盘", description: "定时爬取竞品网站更新 + 数据可视化",
    category: "data", use_case: "产品经理和运营的竞品追踪",
    required_servers: "puppeteer,postgres",
    content: "## 工作流\n1. 定时访问竞品网站\n2. 提取关键信息\n3. 存入数据库\n4. 生成变化报告",
    author: "MCPHub", tags: "竞品,监控,数据,运营",
    is_free: false, price: 9,
    downloads: 45,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
  {
    id: "8", title: "智能客服机器人", description: "基于知识库的多渠道智能客服工作流",
    category: "automation", use_case: "企业客服自动化",
    required_servers: "memory,slack",
    content: "## 工作流\n1. 读取知识库\n2. 理解用户问题\n3. 检索相关答案\n4. 通过多种渠道回复",
    author: "MCPHub", tags: "客服,自动化,知识库",
    is_free: false, price: 19,
    downloads: 28,
    created_at: "2026-01-01", updated_at: "2026-01-01",
  },
];
