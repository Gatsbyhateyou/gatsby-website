# 项目文档

本目录集中存放项目说明与配置指南。

| 文件 | 说明 |
|------|------|
| [AGENT_HANDOFF.md](AGENT_HANDOFF.md) | Agent 交接：指向 .cursor/rules/website-memory.mdc（记忆唯一来源） |
| [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md) | GA4 + PostHog 数据采集配置 |
| [DEPLOY.md](DEPLOY.md) | 使用 GitHub + Vercel 发布到公网 |
| [SUPABASE_SETUP.md](SUPABASE_SETUP.md) | 灵感垃圾桶 · Supabase 配置与建表 |

示例配置文件（仅作参考，不参与构建）在项目根目录的 **`config/`** 下：

- `config/analytics-config.example.js` → 复制到 `public/analytics-config.js` 并填写，详见 [ANALYTICS_SETUP.md](ANALYTICS_SETUP.md)
- `config/supabase-config.example.js` → 复制为 `public/supabase-config.js` 或根目录 `supabase-config.js` 并填写，详见 [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
