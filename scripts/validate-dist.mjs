import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(currentDir, '..');
const distDir = path.join(rootDir, 'dist');

const [indexHtml, headers, robots] = await Promise.all([
  readFile(path.join(distDir, 'index.html'), 'utf8'),
  readFile(path.join(distDir, '_headers'), 'utf8'),
  readFile(path.join(distDir, 'robots.txt'), 'utf8'),
]);

const cspHeader = headers
  .split('\n')
  .find((line) => line.trimStart().startsWith('Content-Security-Policy:'));

if (!cspHeader) {
  throw new Error('Missing Content-Security-Policy header in dist/_headers');
}

const scriptHashes = [...indexHtml.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)]
  .map(([, content]) => content.trim())
  .filter((content) => content.length > 0)
  .map((content) => `sha256-${createHash('sha256').update(content).digest('base64')}`);

for (const hash of scriptHashes) {
  if (!cspHeader.includes(`'${hash}'`)) {
    throw new Error(`CSP is missing script hash ${hash}`);
  }
}

if (/<[^>]+\sstyle=/.test(indexHtml)) {
  throw new Error('Built HTML still contains inline style attributes');
}

if (/<style(?:[^>]*)>/.test(indexHtml)) {
  throw new Error('Built HTML still contains inline style tags');
}

const sitemapMatch = robots.match(/^Sitemap:\s*(.+)$/m);
if (!sitemapMatch) {
  throw new Error('robots.txt is missing a Sitemap entry');
}

const sitemapUrl = sitemapMatch[1].trim();
const sitemapPathname = new URL(sitemapUrl).pathname.replace(/^\//, '');

await readFile(path.join(distDir, sitemapPathname), 'utf8');

console.log('dist validation passed');
