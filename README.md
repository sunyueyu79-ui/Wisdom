# Wisdom 资料书架

无需数据库、无需构建服务器的静态资料馆。GitHub Pages 从 `main` 分支根目录部署。

- 首页：`/Wisdom/`
- 李录访谈：`/Wisdom/articles/li-lu-2026/`
- 资料清单：`catalog.json`
- 首页模板：`templates/library.html`
- 首页生成器：`scripts/build-library.mjs`

## 添加资料

1. 在 `articles/<稳定英文标识>/index.html` 添加阅读页，使用唯一 `data-article-id`。共享资源路径从该目录使用 `../../`。
2. 核对全文、出处与导读；为该资料配置朗读、金句署名及对应章节二维码，不要沿用其他资料的卡片出处。
3. 向 `catalog.json` 添加标题、人物、日期、主题、简介、页数、来源说明和独立路径。
4. 在仓库根目录运行 `node scripts/build-library.mjs`。生成器会检查资料路径和重复标识。
5. 连同生成的 `index.html` 提交，GitHub Pages 自动发布。

## 兼容与进度

旧首页的 `?v=1` 至 `?v=9` 链接，以及 `#p…`、`#text-…`、`#reading`、`#guide`、`#sources` 等旧锚点，自动跳到李录访谈并保留定位。无参数的旧首页链接现在打开书架，第一份资料可直接进入。

阅读与听读进度使用 `wisdom-article-<id>-v1` 分开保存。李录旧的 `wisdom-li-lu-v1` 记录会自动迁移；字号与主题仍在同一浏览器的所有资料间共享。没有登录或云端同步。

Cloudflare Web Analytics 已保留在首页和阅读页。资料内容与相关权利归原权利人，网页内提供出处说明。
