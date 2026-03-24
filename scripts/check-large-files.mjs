import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const maxMb = Number(process.env.MAX_TRACKED_FILE_MB || '25');
const maxBytes = Math.max(1, Math.floor(maxMb * 1024 * 1024));
const demoMaxMb = Number(process.env.MAX_DEMO_FILE_MB || '90');
const demoMaxBytes = Math.max(1, Math.floor(demoMaxMb * 1024 * 1024));

const ignoredPrefixes = [
  '.git/',
  '.vercel/',
  'node_modules/',
  'dist/',
  'dist-ssr/',
];

const largeFiles = [];
const demoPrefix = 'public/demo-samples/';

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)}KB`;
  return `${bytes}B`;
}

function shouldIgnore(relPath) {
  return ignoredPrefixes.some((prefix) => relPath === prefix.slice(0, -1) || relPath.startsWith(prefix));
}

async function scan(dirRel = '') {
  const absDir = path.join(root, dirRel);
  const entries = await readdir(absDir, { withFileTypes: true });

  for (const entry of entries) {
    const relPath = dirRel ? `${dirRel}/${entry.name}` : entry.name;
    if (shouldIgnore(relPath)) continue;

    if (entry.isDirectory()) {
      await scan(relPath);
      continue;
    }

    if (!entry.isFile()) continue;

    const absPath = path.join(root, relPath);
    const info = await stat(absPath);
    const limit = relPath.startsWith(demoPrefix) ? demoMaxBytes : maxBytes;
    if (info.size > limit) {
      largeFiles.push({ path: relPath, size: info.size });
    }
  }
}

await scan();

if (largeFiles.length > 0) {
  console.error(`[check-large-files] Found files exceeding size limits (${maxMb}MB default, ${demoMaxMb}MB for ${demoPrefix}):`);
  for (const file of largeFiles) {
    console.error(`- ${file.path} (${formatBytes(file.size)})`);
  }
  console.error('[check-large-files] Keep demo assets trimmed and avoid committing oversized binaries.');
  process.exit(1);
}

console.log(`[check-large-files] OK: all files within limits (${maxMb}MB default, ${demoMaxMb}MB for ${demoPrefix}).`);
