#!/usr/bin/env node
// build.js — runs at deploy time on Netlify
// Reads all markdown files in /posts/, parses frontmatter, writes /posts/index.json

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(postsDir, 'index.json');

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { meta: {}, body: content };
  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
    meta[key] = val;
  });
  const body = content.slice(match[0].length).trim();
  return { meta, body };
}

const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .sort()
  .reverse(); // newest first (filenames are date-prefixed)

const posts = files.map(filename => {
  const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
  const { meta } = parseFrontmatter(raw);
  return {
    slug: filename.replace('.md', ''),
    title: meta.title || 'Untitled',
    type: meta.type || 'blog',
    date: meta.date || '',
    blurb: meta.blurb || '',
  };
}).filter(p => p.title !== 'Untitled' || p.blurb);

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Built posts/index.json — ${posts.length} post(s)`);
