# UI 风格 · 技能库

本文件夹用来**存放你从网上找到的 SKILL**。每放一个 skill，就让我**按该 skill 的规范亲自设计**对应风格的展示页，而不是手写一套 CSS 应付。

## 用终端直接下载到本文件夹

在项目根目录执行（把 `<skill-source>` 换成你在 skills.sh 找到的，如 `owner/repo@skillname`）：

```powershell
.\scripts\add-skill-to-style-gallery.ps1 <skill-source>
```

示例：

```powershell
.\scripts\add-skill-to-style-gallery.ps1 erichowens/some_claude_skills@vaporwave-glassomorphic-ui-designer
```

脚本会先执行 `npx skills add <source> -y`，然后把安装好的 skill **复制到本文件夹**下的一个子文件夹（以 skill 名命名），方便统一管理。

## 手动放 skill

1. **你把 skill 放进来**  
   - 从 skills.sh 或别处找到的 skill，把它的 `SKILL.md`（或整个技能包）放进本文件夹。  
   - 建议一个风格一个子文件夹，例如：  
     `style-gallery-skills/某风格名/SKILL.md`  
   或直接放单文件：`style-gallery-skills/某风格名.md`。

2. **让我按 skill 生成页面**  
   - 你跟我说：「用 `style-gallery-skills/xxx` 这个 skill 生成一版展示页」。  
   - 我会**读取该 skill 的全文**，按里面的设计原则、规范、示例来设计并写出 HTML/CSS，产出对应风格的预览页。

3. **展示页放哪**  
   - 生成的单页可以放在 `public/style-previews/` 下，命名与风格对应，方便你截图后放进 `public/style-gallery-screenshots/`。

## 从草稿整理过来（我能用的格式）

若你用 **`.\scripts\fetch-top-skill-to-draft.ps1 <英文关键词>`** 把「安装量最高」的 skill 下载到了 **style-gallery-draft/**（草稿），  
我会**读取草稿里的 skill**，按 Cursor 可用的格式（frontmatter + 正文）整理后，**写入本文件夹 style-gallery-skills/**。  
你只需说：「把 style-gallery-draft 里的 skill 整理到 style-gallery-skills」或「把草稿里的 xxx 转成我能用的格式放到 style-gallery-skills」。

## 当前状态

- 本文件夹用来放**已整理、我能直接用的** skill。  
- 放好后说「用 style-gallery-skills 里的 xxx 生成展示页」即可。
