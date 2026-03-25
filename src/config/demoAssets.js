function resolveAssetUrl(path, envUrl) {
  if (envUrl && envUrl.trim()) return envUrl.trim();
  return path;
}

export const DEMO_ASSETS = {
  video: {
    url: resolveAssetUrl('/demo-samples/llm-agents-video-demo.mp4', import.meta.env.VITE_DEMO_VIDEO_URL),
    filename: 'The Rise and Potential of Large Language Model Based Agents【Video-Demo-30s】.mp4',
    size: '83MB',
    meta: 'MP4 · H.264 · 30秒演示版',
  },
  ppt: {
    url: resolveAssetUrl('/demo-samples/llm-agents-deck.pptx', import.meta.env.VITE_DEMO_PPT_URL),
    filename: 'The Rise and Potential of Large Language Model Based Agents【PPt】..pptx',
    size: '66MB',
    meta: 'PPTX · 12页演示文稿',
  },
  poster: {
    url: resolveAssetUrl('/demo-samples/llm-agents-poster.png', import.meta.env.VITE_DEMO_POSTER_URL),
    filename: 'The Rise and Potential of Large Language Model Based Agents【Post】.png',
    size: '8.1MB',
    meta: 'PNG · A3 竖版',
  },
};
