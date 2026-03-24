# 演示物料长期维护方案

更新时间：2026-03-24

## 目标

- 避免大文件导致 Git 推送卡住、协作冲突、Vercel 上传失败。
- 保持演示页可真实播放/下载，不依赖本地临时文件。
- 让多人协作时有统一规则，降低“改一版又坏一版”的风险。

## 方案总览

1. **演示物料白名单入库（轻量版）**
   - 仅允许 3 个固定演示文件：
     - `public/demo-samples/llm-agents-video-demo.mp4`（30秒演示版）
     - `public/demo-samples/llm-agents-deck.pptx`
     - `public/demo-samples/llm-agents-poster.png`
   - 其他文件仍被 `.gitignore` 拦截。

2. **前端统一读取配置**
   - 配置文件：`src/config/demoAssets.js`
   - Delivery 页只读这份配置，后续替换物料时只改配置，不到处改代码。

3. **构建前大文件守卫**
   - 脚本：`scripts/check-large-files.mjs`
   - 默认限制：仓库文件 `<=25MB`
   - 例外限制：`public/demo-samples/` 下文件 `<=90MB`
   - 任何超限会让 `npm run build` 直接失败，提前阻断“超大文件卡死协作”。

4. **可配置项（可选）**
   - 如需临时指向其他物料地址，可设置：
     - `VITE_DEMO_VIDEO_URL`
     - `VITE_DEMO_PPT_URL`
     - `VITE_DEMO_POSTER_URL`
   - 不设置时默认走仓库内白名单文件。

## 协作规范（给所有协作者）

1. 不要把“原始大视频”放进仓库，只保留演示剪辑版。
2. 演示物料目录只允许这 3 个白名单文件名。
3. 提交前运行：
   - `npm run check:large-files`
4. 如果要替换演示视频，先压缩/裁剪到 90MB 内，再覆盖白名单文件。

## 后续升级（接后端后）

当后端就绪后，建议迁移到对象存储（S3/R2/Supabase Storage）：

- 数据库存储文件元信息（project_id, asset_type, url, size, created_at）。
- 文件本体在对象存储，前端通过签名 URL 播放/下载。
- 这样可以无缝从“演示物料”过渡到“真实用户生成物料”。
