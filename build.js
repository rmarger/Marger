#!/usr/bin/env node
// build.js — runs at deploy time on Netlify
// Reads all markdown posts, writes posts/index.json and individual post HTML pages

const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');

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
  return { meta, body: content.slice(match[0].length).trim() };
}

function renderBody(body) {
  return body
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/<(https?:\/\/[^>]+)>/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .split(/\n\n+/)
    .map(p => p.trim() ? `<p>${p.replace(/\n/g, ' ')}</p>` : '')
    .join('\n');
}

function postPage(meta, body) {
  const typeLabels = { caselaw: 'Case law', blog: 'Blog', update: 'Update' };
  const typeClasses = { caselaw: 'type-caselaw', blog: 'type-blog', update: 'type-update' };
  const typeLabel = typeLabels[meta.type] || 'Post';
  const typeClass = typeClasses[meta.type] || 'type-blog';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title} — Marger Law Firm, P.A.</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--cream:#FAF8F4;--warm-dark:#2C2B28;--accent:#8B6B4A;--accent-light:#F0E8DC;--muted:#6B6660;--border:rgba(0,0,0,0.1)}
    html{scroll-behavior:smooth}
    body{font-family:'Source Sans 3',sans-serif;background:var(--cream);color:var(--warm-dark);line-height:1.7}
    nav{position:sticky;top:0;z-index:100;background:var(--cream);border-bottom:0.5px solid var(--border);padding:0 2rem;display:flex;align-items:center;justify-content:space-between;height:64px}
    .nav-logo{font-family:'Lora',serif;font-size:17px;font-weight:500;text-decoration:none;color:var(--warm-dark);letter-spacing:-0.01em}
    .nav-cta{font-size:13px;font-family:'Source Sans 3',sans-serif;font-weight:600;background:var(--accent);color:#FAF8F4;border:none;border-radius:4px;padding:8px 18px;text-decoration:none;transition:opacity 0.2s}
    .nav-cta:hover{opacity:0.85}
    .post{max-width:680px;margin:0 auto;padding:3rem 2rem 5rem}
    .back{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--muted);text-decoration:none;margin-bottom:2rem;transition:color 0.2s}
    .back:hover{color:var(--accent)}
    .post-type{display:inline-block;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:3px 10px;border-radius:3px;margin-bottom:1rem}
    .type-caselaw{background:#EAF3DE;color:#3B6D11}
    .type-blog{background:#E6F1FB;color:#185FA5}
    .type-update{background:#FAEEDA;color:#854F0B}
    h1{font-family:'Lora',serif;font-size:32px;font-weight:400;line-height:1.25;margin-bottom:0.75rem}
    .post-date{font-size:13px;color:var(--muted);margin-bottom:2rem;padding-bottom:2rem;border-bottom:0.5px solid var(--border)}
    .post-body p{font-size:16px;color:var(--warm-dark);margin-bottom:1.25rem;font-weight:300}
    .post-body strong{font-weight:600}
    .post-body a{color:var(--accent);word-break:break-all}
    .post-body a:hover{text-decoration:underline}
    .cta-box{background:var(--accent-light);border-radius:8px;padding:1.5rem 2rem;margin-top:3rem}
    .cta-box p{font-size:15px;margin-bottom:1rem;font-weight:300}
    .cta-btn{display:inline-block;background:var(--accent);color:#FAF8F4;border-radius:4px;padding:10px 20px;font-size:14px;font-weight:600;text-decoration:none;transition:opacity 0.2s}
    .cta-btn:hover{opacity:0.85}
    footer{background:var(--warm-dark);color:rgba(250,248,244,0.6);padding:2rem;text-align:center;font-size:13px;line-height:1.8}
    footer strong{color:rgba(250,248,244,0.9);font-weight:500}
    @media(max-width:700px){.post{padding:2rem 1.25rem 4rem}h1{font-size:24px}nav{padding:0 1.25rem}}
  </style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo">Marger Law Firm, P.A.</a>
  <a href="/#contact" class="nav-cta">Free Consultation</a>
</nav>
<div class="post">
  <a href="/#insights" class="back">← Back to Insights</a>
  <span class="post-type ${typeClass}">${typeLabel}</span>
  <h1>${meta.title}</h1>
  <p class="post-date">${meta.date}</p>
  <div class="post-body">${renderBody(body)}</div>
  <div class="cta-box">
    <p>Have questions about how this may affect your case? We're here to help.</p>
    <a href="/#contact" class="cta-btn">Schedule a free consultation</a>
  </div>
</div>
<footer>
  <strong>Marger Law Firm, P.A.</strong><br>
  &copy; 2026 &middot; Southern Florida<br>
  <span style="font-size:12px;opacity:0.5;margin-top:6px;display:block;">This website is for informational purposes only and does not constitute legal advice.</span>
</footer>
</body>
</html>`;
}

// Read all markdown files
const files = fs.readdirSync(postsDir)
  .filter(f => f.endsWith('.md'))
  .sort().reverse();

const posts = files.map(filename => {
  const raw = fs.readFileSync(path.join(postsDir, filename), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const slug = filename.replace('.md', '');

  // Generate individual HTML page
  const html = postPage(meta, body);
  fs.writeFileSync(path.join(postsDir, slug + '.html'), html);
  console.log(`  Generated posts/${slug}.html`);

  return {
    slug,
    title: meta.title || 'Untitled',
    type: meta.type || 'blog',
    date: meta.date || '',
    blurb: meta.blurb || '',
  };
});

// Write index.json
const indexPath = path.join(postsDir, 'index.json');
fs.writeFileSync(indexPath, JSON.stringify(posts, null, 2));
console.log(`Built posts/index.json — ${posts.length} post(s)`);
