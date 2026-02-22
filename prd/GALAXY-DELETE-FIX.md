# Galaxy 星尘删除修复方案

## 问题

Galaxy 页点击删除星星后，刷新页面星星仍会出现。  
**根因**：`supabase-idea-bin.js` 未实现 `delete` 方法；Supabase 表 `inspirations` 未配置 delete 的 RLS 策略。

---

## 一、前端：为 ideaBinApi 增加 delete 方法

**文件**：`public/supabase-idea-bin.js`

**修改**：在 `load` 方法后追加 `delete` 方法：

```javascript
/** 删除一条灵感，按 id 删除；成功或失败都 resolve */
delete: function (id) {
  return client
    .from(TABLE)
    .delete()
    .eq('id', id)
    .then(function (res) {
      if (res.error) throw res.error;
      return;
    });
}
```

**完整 api 对象**（供参考）：

```javascript
window.ideaBinApi = {
  save: function (content) { /* 现有 */ },
  load: function () { /* 现有 */ },
  delete: function (id) {
    return client
      .from(TABLE)
      .delete()
      .eq('id', id)
      .then(function (res) {
        if (res.error) throw res.error;
        return;
      });
  }
};
```

---

## 二、Supabase：为 inspirations 表添加 delete 策略

**当前 RLS 策略**：仅 `insert`、`select`，**无** `delete`。  
需要新增一条允许匿名删除的策略。

**操作步骤**：

1. 打开 [Supabase 控制台](https://supabase.com/dashboard) → 进入你的项目  
2. 左侧 **SQL Editor** → **New query**  
3. 粘贴并执行下面 SQL：

```sql
-- 允许匿名删除 inspirations 表中的记录
create policy "允许匿名删除"
  on public.inspirations for delete
  using (true);
```

4. 执行成功后，在 **Authentication** → **Policies** 中应能看到 `inspirations` 表新增的 `允许匿名删除` 策略。

---

## 三、Galaxy 侧删除流程（现有逻辑，无需修改）

`Galaxy.html` 中 `deleteStarFromStorage` 已按以下逻辑工作：

1. 若 `ideaBinApi` 存在且 `ideaBinApi.delete` 存在 → 调用 `api.delete(id)`  
2. 成功后执行 `onDone`（从 `particles` 中移除、关闭浮层）  
3. 若 `ideaBinApi` 不存在或 `delete` 未实现 → 回退到 localStorage

完成上述一、二后，删除会正确调用 Supabase，刷新后星星将不再出现。

---

## 四、验证步骤

| 步骤 | 操作 | 预期 |
|------|------|------|
| 1 | 在灵感垃圾桶输入一条内容并吞噬 | 写入 Supabase，Galaxy 页出现对应星星 |
| 2 | 在 Galaxy 页点击该星星 → 点击「删除」→ 确认 | 星星从画布消失 |
| 3 | 刷新 Galaxy 页 | 该星星不再出现 |
| 4 | 打开 Supabase Table Editor → `inspirations` | 对应记录已删除 |

---

## 五、安全检查（可选）

当前 `using (true)` 允许匿名删除任意记录。若将来接入用户登录，可改为按 `user_id` 限制：

```sql
-- 仅允许删除本人记录（需先接入 Auth）
create policy "允许删除本人记录"
  on public.inspirations for delete
  using (auth.uid() = user_id OR user_id IS NULL);
```

当前未接入 Auth，使用 `using (true)` 即可。

---

## 六、行动清单

- [ ] 1. 在 `public/supabase-idea-bin.js` 中为 `ideaBinApi` 添加 `delete` 方法  
- [ ] 2. 在 Supabase SQL Editor 中执行新增 delete 策略的 SQL  
- [ ] 3. 部署到 Vercel（或重新构建后刷新）  
- [ ] 4. 按「验证步骤」在线上环境测试删除与刷新
