# Workflow: Adding Blog Posts

Since the blog engine supports Internationalization (I18n), adding a new post requires creating files for both English and French.

## 1. File Naming
Create two files in `content/blog/` for your post slug (e.g., `my-new-post`):
- `content/blog/my-new-post.en.mdx` (English)
- `content/blog/my-new-post.fr.mdx` (French)

## 2. Frontmatter Protocol
Ensure both files have identical metadata structure, but localized values.

**English (`.en.mdx`):**
```yaml
---
title: "My New Post"
description: "A short description for the card."
date: "2026-01-09"
tags: ["Tech", "Design"]
coverImage: "/images/blog/cover.jpg"
author: "Damien Schonbakler"
---
```

**French (`.fr.mdx`):**
```yaml
---
title: "Mon Nouvel Article"
description: "Une courte description pour la carte."
date: "2026-01-09"
tags: ["Tech", "Design"]
coverImage: "/images/blog/cover.jpg"
author: "Damien Schonbakler"
---
```

## 3. Writing Content
Write standard MDX content.
- Use `## Headers` for structure.
- Code blocks are supported.
- React components can be used if configured in `MDXRemote`.

## 4. Verification
Run `npm run build` to ensure:
- Both files are detected.
- Slugs match exactly (if they drift, one language might 404).
