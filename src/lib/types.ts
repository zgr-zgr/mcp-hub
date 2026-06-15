// ====================================================
// MCPHub 核心数据类型定义
// ====================================================

/** MCP Server 条目 */
export interface McpServer {
  id: string;
  name: string;           // 如 "filesystem"
  display_name: string;   // 如 "File System MCP Server"
  description: string;
  category: McpCategory;
  /** 安装命令，如 "npx -y @modelcontextprotocol/server-filesystem" */
  install_command: string;
  /** 传输方式: stdio / sse / streamable-http */
  transport: "stdio" | "sse" | "streamable-http";
  /** 官方仓库 URL */
  repo_url: string;
  /** 文档 URL */
  docs_url?: string;
  /** 作者 */
  author: string;
  /** 许可证 */
  license?: string;
  /** 标签（逗号分隔） */
  tags: string;
  /** AI 自动生成的评测摘要 */
  ai_summary?: string;
  /** Logo 图片 URL（可为空，用默认图标） */
  logo_url?: string;
  /** 星标数（手动或自动同步） */
  stars: number;
  /** 浏览量 */
  views: number;
  /** 是否精选推荐 */
  featured: boolean;
  created_at: string;
  updated_at: string;
}

/** MCP Server 分类 */
export type McpCategory =
  | "browser"        // 浏览器/网页
  | "filesystem"     // 文件系统
  | "database"       // 数据库
  | "api"            // API 集成
  | "dev-tools"      // 开发工具
  | "cloud"          // 云服务
  | "ai"             // AI/LLM
  | "security"       // 安全
  | "communication"  // 通讯
  | "other";         // 其他

/** 分类的中文显示名 */
export const CATEGORY_LABELS: Record<McpCategory, string> = {
  browser: "🌐 浏览器",
  filesystem: "📁 文件系统",
  database: "🗄️ 数据库",
  api: "🔌 API 集成",
  "dev-tools": "🛠️ 开发工具",
  cloud: "☁️ 云服务",
  ai: "🤖 AI/LLM",
  security: "🔒 安全",
  communication: "💬 通讯",
  other: "📦 其他",
};

/** Workflow / Prompt 模板 */
export interface Template {
  id: string;
  title: string;
  description: string;
  /** 模板分类 */
  category: TemplateCategory;
  /** 适用场景 */
  use_case: string;
  /** 需要用到的 MCP Server 名称列表（逗号分隔） */
  required_servers: string;
  /** 模板内容（Markdown 格式的 Prompt / Workflow 描述） */
  content: string;
  /** 预览图 URL */
  preview_url?: string;
  /** 下载次数 */
  downloads: number;
  /** 是否免费 */
  is_free: boolean;
  /** 价格（如果不是免费） */
  price?: number;
  author: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

/** 模板分类 */
export type TemplateCategory =
  | "coding"          // 编码开发
  | "writing"         // 写作内容
  | "research"        // 研究分析
  | "automation"      // 自动化流程
  | "data"            // 数据处理
  | "creative"        // 创意设计
  | "other";          // 其他

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  coding: "💻 编码开发",
  writing: "✍️ 写作内容",
  research: "🔬 研究分析",
  automation: "⚡ 自动化流程",
  data: "📊 数据处理",
  creative: "🎨 创意设计",
  other: "📦 其他",
};

/** 用户评价 */
export interface Review {
  id: string;
  server_id: string;
  user_name: string;
  rating: number;       // 1-5 星
  comment: string;
  created_at: string;
}
