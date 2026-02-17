# 灵感垃圾桶 · Supabase 配置说明

## 1. 获取「项目 URL」和「anon key」

1. 打开 [Supabase 控制台](https://supabase.com/dashboard) 并登录。
2. 点击 **New project** 新建项目（选一个区域、填项目名、设数据库密码，然后创建）。
3. 项目建好后，左侧点 **Project Settings**（齿轮图标），再点 **API Keys**。
4. 在页面上找到并复制：
   - **Project URL**：若本页没有，到 **General** 里找，形如 `https://xxxxx.supabase.co`
   - **公网可用的 key**：在 **Publishable key** 那一栏里，复制 `default` 对应的那一串（以 `sb_publishable_` 开头）；若你用的是「Legacy anon, service_role API keys」选项卡，则复制 **anon** 那一行的 key。不要用 Secret keys。

把这两个值填到项目里的 `supabase-config.js` 中（见下方「本地配置」）。

---

## 2. 在 Supabase 里建表

**具体操作：**

1. 打开 [Supabase 控制台](https://supabase.com/dashboard)，进入你的项目。
2. 在左侧边栏找到 **SQL Editor**（图标像 `</>` 或「代码」），点击进入。
3. 点击页面上的 **New query**（或「新建查询」），会出现一个空白输入框。
4. 从下面「要复制的 SQL」里**全选并复制**整段（从 `-- 灵感表` 到最后一个 `;` 的 `true);`）。
5. 在 SQL Editor 的输入框里 **Ctrl+V（或 Cmd+V）粘贴**。
6. 点击输入框下方的 **Run**（或「运行」）按钮执行。
7. 若成功，会提示成功；若有报错，把报错信息复制下来便于排查。

**要复制的 SQL：**（下面代码块里的全部内容）

```sql
-- 灵感表：为以后多用户预留 user_id，当前可留空
create table if not exists public.inspirations (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  user_id uuid,
  created_at timestamptz not null default now()
);

-- 允许匿名（前端）读、插；以后加登录可改为 RLS 按 user_id 过滤
alter table public.inspirations enable row level security;

create policy "允许匿名插入"
  on public.inspirations for insert
  with check (true);

create policy "允许匿名读取"
  on public.inspirations for select
  using (true);
```

建好后，在 **Table Editor** 里能看到 `inspirations` 表即可。

---

## 3. 本地配置（不要提交到 Git）

1. 在项目根目录复制示例配置：
   - 把 `supabase-config.example.js` 复制为 `supabase-config.js`。
2. 打开 `supabase-config.js`，把里面的占位符换成你在第 1 步拿到的：
   - `SUPABASE_URL`：你的 Project URL
   - `SUPABASE_ANON_KEY`：你的 anon public key

`supabase-config.js` 已被加入 `.gitignore`，不会被提交，避免泄露 key。

---

## 4. 运行与验证

- 本地：在项目根目录执行 `npm run dev`，打开首页或任意带「灵感垃圾桶」的页面，写一句话点「吞噬」。
- 打开 Supabase 控制台 → **Table Editor** → `inspirations`，应能看到新插入的一行。

「星尘遗落」（Galaxy）页会从 Supabase 拉取列表展示；若未配置或请求失败，会退回使用本地的 `localStorage` 数据。

---

## 操作顺序小结

| 顺序 | 做什么 | 在哪里 |
|------|--------|--------|
| ① | 拿到 Project URL 和 Publishable key（或 anon key） | Supabase 控制台 → Project Settings → API Keys（URL 可能在 General） |
| ② | 执行建表 SQL | 控制台左侧 SQL Editor → New query → 粘贴下面整段 SQL → Run |
| ③ | 复制 `supabase-config.example.js` 为 `supabase-config.js`，填上 ① 的两个值 | 项目根目录 |
| ④ | 本地跑起来并试一次「吞噬」 | 终端 `npm run dev`，浏览器打开站点，用灵感垃圾桶投一条，再到 Table Editor 看 `inspirations` 表是否有新行 |
