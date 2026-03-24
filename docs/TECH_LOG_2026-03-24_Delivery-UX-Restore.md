# SCI-VISION 技术日志（2026-03-24）

## 主题
Delivery 页面回退并增强：恢复原有预览体验、补回播放器配置入口、整理可演示物料交互。

## 背景
用户反馈当前 Delivery 页偏离原设计，主要问题：

1. 左下角原本的滚动 PPT 预览被删除。
2. 海报展示位置不理想，希望放在右侧导出区域并支持预览。
3. 视频播放器配置入口缺失（清晰度、倍速等体验退化）。
4. 希望像 keling 一样有素材类型切换，信息更清晰。

## 本次实现（已上线）
代码文件：
`src/pages/Delivery.jsx`

核心改动：

1. 新增顶部素材切换标签（`全部 / 视频 / PPT / 海报`）。
2. 恢复并优化左侧 `PPT 滚动预览`（横向卡片滚动）。
3. 将海报预览能力移到右侧导出区：
   - `下载宣传海报` 行新增 `预览` 按钮；
   - 点击后弹出海报大图预览弹窗。
4. 恢复视频配置交互：
   - 倍速菜单（`0.5x ~ 2x`）；
   - 清晰度选择（`720p / 1080p / 4K`）；
   - 清晰度升级积分确认弹窗；
   - 自定义进度条与时间显示。
5. 保留原有业务动作：
   - `← 回到项目库`
   - `+ 解读下一篇`

## 关键修复点（避免线上崩溃）
在重构过程中发现 `ExportAction` 组件调用存在但定义缺失，会导致运行时报错（页面加载后 React 抛错）。

已补回 `ExportAction` 组件并再次构建、部署验证。

## 验证记录
本地构建：
- `npm run build` 通过

线上部署：
- `vercel deploy --prod --yes --force` 成功
- 生产别名：<https://sci-vision-demo.vercel.app>

可访问性检查（HTTP 200）：
- `/`
- `/demo-samples/llm-agents-video-demo.mp4`
- `/demo-samples/llm-agents-deck.pptx`
- `/demo-samples/llm-agents-poster.png`

## Git 记录
- 提交：`c6d2654`
- 标题：`feat: restore delivery previews and media controls UX`
- 分支：`main`
- 推送：`origin/main` 已完成

## 风险与后续
1. `npm run lint` 目前仍有历史遗留问题（非本次改动引入），涉及：
   - `src/pages/Analysis.jsx`
   - `src/pages/Library.jsx`
   - `src/pages/Pipeline.jsx`
2. 建议下一步单开一次“Lint 清债”任务，避免后续迭代被噪音干扰。

