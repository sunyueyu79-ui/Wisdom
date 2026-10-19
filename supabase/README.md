# Wisdom 收藏服务配置

状态：网页代码已完成本地验证；维护者已执行建表 SQL，线上匿名读取被数据库拒绝。真实账号的保存、跨设备同步与邮件投递仍需登录后验收。

1. 在项目 SQL Editor 中执行 `setup.sql` 一次。它只创建 `wisdom_favorites` 新表，并设置账号隔离；不更改现有表。若该表已经存在，停止并检查结构，不要删除旧数据后重跑。
2. Authentication → URL Configuration：Site URL 设为 `https://sunyueyu79-ui.github.io/Wisdom/`，将同一地址加入 Redirect URLs。
3. 使用 Email 密码登录。面向普通访客开放注册前，配置自己的 SMTP 并保留邮箱确认。Supabase 默认邮件服务只向项目团队授权地址发送邮件，不能据此认为任意读者均能注册。不要为绕过邮件限制关闭邮箱确认。
4. 完成后执行 `verify-rls.sql` 验证数据库角色权限。脚本使用事务内测试数据，末尾 rollback，不保留测试收藏或账号。
5. 发布前，用两个测试账号分别登录，确认各自看不到对方收藏；用同一账号在两个独立浏览器中测试保存、刷新同步、移除同步、退出和重新登录。不要把后台管理密码当作读者账号密码。

公开 publishable key 在 `favorites.js` 中，依靠 Auth + RLS 授权；不能用它建表。不要把 secret key、service_role 或数据库密码放入网页或仓库。

第一版同步金句文字、资料名、页码和创建时间。图片仍在设备端生成，不上传图片。收藏不发送给 Umami。阅读/听读进度继续仅保存在浏览器中。已有本地图片不会自动导入云端。

前端验证：`node work/test_favorites.cjs`（从本地工作区根目录运行）。该测试模拟 SDK，不能替代真实 RLS 和跨设备验收。

官方文档：https://supabase.com/docs/guides/database/postgres/row-level-security 和 https://supabase.com/docs/guides/auth/auth-smtp
