# Marger Law Firm — Website

## How to deploy (free, ~15 minutes)

### Step 1 — Put the files on GitHub
1. Go to https://github.com and create a free account if you don't have one
2. Click **New repository** → name it `marger-law-website` → click **Create repository**
3. Upload all the files from this folder (drag and drop in the GitHub interface)
4. Click **Commit changes**

### Step 2 — Deploy on Netlify
1. Go to https://netlify.com and sign up free (use "Sign in with GitHub")
2. Click **Add new site** → **Import an existing project** → **GitHub**
3. Select your `marger-law-website` repository
4. Build settings will auto-populate from `netlify.toml` — just click **Deploy site**
5. Your site will be live at a random URL like `https://amazing-name-123.netlify.app`

### Step 3 — Enable the CMS (so you can add posts)
1. In Netlify, go to **Site configuration** → **Identity** → click **Enable Identity**
2. Under **Registration**, set to **Invite only**
3. Scroll to **Services** → **Git Gateway** → click **Enable Git Gateway**
4. Go to **Identity** → **Invite users** → enter your email address
5. Check your email and accept the invite — set a password
6. Now go to `https://your-site.netlify.app/admin/` to log in and add posts

### Step 4 — Add a custom domain (optional, ~$12/year)
1. Buy a domain at https://namecheap.com (e.g. `margerlaw.com`)
2. In Netlify: **Domain management** → **Add a domain** → enter your domain
3. Follow Netlify's instructions to update your DNS at Namecheap (takes ~1 hour)

---

## How to update the site

### Adding a blog post or case law blurb
1. Go to `https://your-site.netlify.app/admin/`
2. Log in → click **New Insights & Posts**
3. Fill in the title, type, blurb, and date → click **Publish**
4. The site updates automatically within ~60 seconds

### Updating your phone/email/address
Open `index.html` and search for `<!-- UPDATE THIS -->` — there are 3 spots.

### Adding your photo
- Save your photo as `images/hero.jpg` (or `attorney.jpg` for the about section)
- In `index.html`, find the comment `<!-- Replace with: <img src=... -->` and swap in the img tag

---

## File structure
```
marger-law/
├── index.html          ← main website
├── build.js            ← generates posts/index.json at deploy time
├── netlify.toml        ← Netlify build config
├── package.json
├── admin/
│   ├── index.html      ← CMS interface (login at /admin/)
│   └── config.yml      ← CMS field definitions
└── posts/
    ├── index.json      ← auto-generated, do not edit
    └── *.md            ← your blog/case law posts (managed via CMS)
```
