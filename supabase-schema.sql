-- ====================================================
-- MCPHub 数据库表结构
-- 复制到 Supabase SQL Editor 中执行
-- ====================================================

-- 1. MCP Server 表
CREATE TABLE IF NOT EXISTS servers (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL UNIQUE,
  display_name    TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  category        TEXT NOT NULL DEFAULT 'other',
  install_command TEXT NOT NULL DEFAULT '',
  transport       TEXT NOT NULL DEFAULT 'stdio',
  repo_url        TEXT NOT NULL DEFAULT '',
  docs_url        TEXT DEFAULT '',
  author          TEXT NOT NULL DEFAULT '',
  license         TEXT DEFAULT '',
  tags            TEXT NOT NULL DEFAULT '',
  ai_summary      TEXT DEFAULT '',
  logo_url        TEXT DEFAULT '',
  stars           INTEGER NOT NULL DEFAULT 0,
  views           INTEGER NOT NULL DEFAULT 0,
  featured        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 模板表
CREATE TABLE IF NOT EXISTS templates (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title            TEXT NOT NULL,
  description      TEXT NOT NULL DEFAULT '',
  category         TEXT NOT NULL DEFAULT 'other',
  use_case         TEXT NOT NULL DEFAULT '',
  required_servers TEXT NOT NULL DEFAULT '',
  content          TEXT NOT NULL DEFAULT '',
  preview_url      TEXT DEFAULT '',
  downloads        INTEGER NOT NULL DEFAULT 0,
  is_free          BOOLEAN NOT NULL DEFAULT true,
  price            INTEGER DEFAULT 0,
  author           TEXT NOT NULL DEFAULT '',
  tags             TEXT NOT NULL DEFAULT '',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 评价表
CREATE TABLE IF NOT EXISTS reviews (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  server_id  UUID NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  user_name  TEXT NOT NULL DEFAULT '匿名用户',
  rating     INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment    TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================
-- 种子数据 — 收录 GitHub 上最热门的 MCP Server
-- ====================================================

INSERT INTO servers (name, display_name, description, category, install_command, transport, repo_url, author, license, tags, ai_summary, stars, featured) VALUES

('filesystem',     'File System',          '安全的文件系统操作，支持读写文件、目录浏览',             'filesystem', 'npx -y @modelcontextprotocol/server-filesystem /path/to/dir', 'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', '文件,目录,读写,安全',                '官方出品的基础 MCP Server，提供沙盒化的文件系统读写能力，是所有需要文件操作的 Agent 的必备工具。', 4200, true),
('github',         'GitHub',               '管理仓库、Issue、PR、代码搜索',                       'dev-tools',  'npx -y @modelcontextprotocol/server-github',              'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', 'GitHub,仓库,Issue,PR,代码',         '让你的 Agent 直接操作 GitHub：创建仓库、管理 Issue、发起 PR、搜索代码，开发流程全自动化。', 3800, true),
('postgres',       'PostgreSQL',           'PostgreSQL 数据库查询和管理',                          'database',  'npx -y @modelcontextprotocol/server-postgres',            'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', '数据库,SQL,PostgreSQL',             '连接 PostgreSQL 数据库，允许 Agent 执行 SQL 查询、查看表结构，数据分析场景的核心工具。', 2900, true),
('puppeteer',      'Puppeteer',            '浏览器自动化：导航、截图、点击、填表',                 'browser',   'npx -y @modelcontextprotocol/server-puppeteer',          'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', '浏览器,截图,自动化,测试',           '让 Agent 控制真实浏览器：导航网页、截图、点击按钮、填表提交，Web 自动化的终极方案。', 5100, true),
('brave-search',   'Brave Search',         '通过 Brave Search API 进行网络搜索',                   'api',       'npx -y @anthropic/mcp-server-brave-search',              'stdio', 'https://github.com/anthropics/mcp-server-brave-search', 'Anthropic', 'MIT', '搜索,网络,信息检索',                '集成 Brave Search，让 Agent 能够联网获取实时信息，不再局限于训练数据。', 2600, false),
('memory',         'Memory',               '持久化记忆系统，跨会话知识图谱',                       'ai',        'npx -y @modelcontextprotocol/server-memory',             'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', '记忆,知识图谱,持久化',              '为 Agent 提供长期记忆能力，基于知识图谱跨会话保存和检索信息，智能体真正"记住"你。', 1800, false),
('slack',          'Slack',                'Slack 消息发送、频道管理',                             'communication', 'npx -y @modelcontextprotocol/server-slack',           'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic',      'MIT', 'Slack,消息,通讯,通知',              '让 Agent 连接 Slack 工作空间，自动发送通知、管理频道、处理消息。', 1500, false),
('playwright',     'Playwright',           '微软 Playwright 浏览器自动化',                         'browser',   'npx -y @anthropic/mcp-server-playwright',               'stdio', 'https://github.com/anthropics/mcp-server-playwright', 'Anthropic', 'MIT', '浏览器,Playwright,测试,自动化',     '基于 Playwright 的浏览器 MCP Server，支持更精细的页面交互和测试能力。', 3200, false),
('everything',     'Everything',           '一站式参考 Server，聚合多个工具',                      'dev-tools',  'npx -y @anthropic/mcp-server-everything',               'stdio', 'https://github.com/anthropics/mcp-server-everything', 'Anthropic', 'MIT', '综合,参考,工具集',                  '集合了多种开发工具的参考 MCP Server，适合快速体验 MCP 的所有能力。', 1200, false),

-- 社区热门
('exa',            'Exa Search',           'AI 语义搜索引擎，专为 LLM 设计',                      'api',       'npx -y @anthropic/mcp-server-exa',                      'stdio', 'https://github.com/anthropics/mcp-server-exa', 'Anthropic', 'MIT', '搜索,语义,LLM,内容发现',            'Exa 是专为 AI 设计的搜索引擎，语义理解而非关键词匹配，搜索结果更适合 LLM 消费。', 1800, false),
('sequential-thinking', 'Sequential Thinking', '分步推理引擎，复杂问题拆解',                     'ai',        'npx -y @modelcontextprotocol/server-sequential-thinking', 'stdio', 'https://github.com/modelcontextprotocol/servers', 'Anthropic', 'MIT', '推理,思维链,复杂问题',              '提供分步推理解题能力，特别适合数学证明、逻辑分析等需要链式思考的场景。', 2200, false)
ON CONFLICT (name) DO NOTHING;

-- ====================================================
-- 种子模板数据
-- ====================================================

INSERT INTO templates (title, description, category, use_case, required_servers, content, author, tags, is_free, downloads) VALUES

('全栈开发助手', '用 AI Agent 从零搭建全栈 Web 应用', 'coding', '从需求描述到可运行的 Web 应用', 'github,filesystem,postgres', '## 工作流
1. 分析用户需求，生成项目结构
2. 通过 `filesystem` 创建项目文件和目录
3. 通过 `github` 创建仓库并初始化
4. 通过 `postgres` 设计并创建数据库表
5. 提交代码并发起 PR

## Prompt
```
请根据以下需求，帮我创建一个全栈 Web 应用：
[填入你的需求描述]

要求：
1. 使用 Next.js + TypeScript
2. 数据库使用 PostgreSQL
3. 完成后推送到 GitHub
```', 'MCPHub', '全栈,Web,开发,入门', true, 128),

('每日新闻简报生成器', '自动抓取新闻 → AI 总结 → 发送到 Slack', 'automation', '每天早上自动推送新闻摘要', 'brave-search,slack', '## 工作流
1. 通过 `brave-search` 搜索今日热门新闻
2. AI 自动总结为 500 字简报
3. 通过 `slack` 发送到指定频道

## Prompt
```
请搜索今天的热门科技新闻，总结为 500 字以内的简报，
发送到 Slack #daily-news 频道。
格式：标题 + 3 要点 + 来源链接
```', 'MCPHub', '新闻,自动化,Slack,日报', true, 86),

('代码审查助手', 'AI 自动审查 PR 代码质量 + 安全漏洞', 'coding', '每次 PR 提交自动触发审查', 'github,puppeteer', '## 工作流
1. 监控 GitHub 新 PR
2. 拉取代码 diff
3. AI 分析：代码规范、潜在 Bug、安全漏洞
4. 在 PR 下自动发表审查评论

## Prompt
```
请审查这个 PR 的代码变更，关注以下方面：
1. 代码规范和可读性
2. 潜在的性能问题
3. 安全漏洞（SQL 注入、XSS 等）
4. 测试覆盖率是否足够

对每个问题给出严重级别（🔴/🟡/🟢）和修复建议。
```', 'MCPHub', '代码审查,自动化,PR,安全', true, 203),

('学术研究助手', '联网搜索文献 → 阅读总结 → 生成综述', 'research', '快速完成文献综述和资料整理', 'brave-search,filesystem,sequential-thinking', '## 工作流
1. 通过 `brave-search` 搜索学术文献
2. 通过 `sequential-thinking` 分步分析
3. 通过 `filesystem` 保存结构化笔记

## Prompt
```
请帮我研究以下课题的学术现状：
[填入课题名称]

要求：
1. 搜索最近 3 年的关键论文
2. 提取每篇的核心观点和方法
3. 对比不同方法的优劣
4. 生成结构化的文献综述
```', 'MCPHub', '学术,研究,文献,综述', true, 67),

('网页数据采集器', '自动浏览网页 → 提取结构化数据 → 存入数据库', 'data', '竞品分析、数据采集、舆情监控', 'puppeteer,postgres', '## 工作流
1. 通过 `puppeteer` 打开目标网页
2. 提取指定数据字段
3. AI 清洗和结构化数据
4. 通过 `postgres` 写入数据库

## Prompt
```
请访问 [目标网站 URL]，提取以下信息：
- 产品名称
- 价格
- 用户评分
- 核心卖点

将所有数据以 JSON 格式输出并存入数据库。
```', 'MCPHub', '爬虫,数据采集,竞品分析', true, 91)

ON CONFLICT DO NOTHING;

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_servers_category ON servers(category);
CREATE INDEX IF NOT EXISTS idx_servers_featured ON servers(featured);
CREATE INDEX IF NOT EXISTS idx_servers_name   ON servers(name);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_reviews_server_id  ON reviews(server_id);
