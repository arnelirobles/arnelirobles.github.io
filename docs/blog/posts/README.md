# Local Blog Posts

This directory contains local markdown blog posts.

## How to Add a New Post

### Step 1: Create the Markdown File

Create a new file: `YYYY-MM-DD-post-slug.md`

Example: `2025-12-21-my-awesome-post.md`

### Step 2: Add Frontmatter

```markdown
---
title: Your Post Title
description: Brief description for SEO
date: 2025-12-21
author: Arnel I. Robles
tags: [javascript, tutorial, webdev]
categories: [Tech]
image: /logo.png
featured: false
draft: false
---

# Your Post Title

Your content here...
```

### Step 3: Register the Post

Edit: `docs/.vitepress/theme/composables/useLocalPosts.ts`

Add your post to the array:

```typescript
{
  title: 'Your Post Title',
  description: 'Brief description for SEO',
  date: '2025-12-21',
  url: '/blog/posts/2025-12-21-my-awesome-post',
  excerpt: 'First few sentences of your post...',
  author: 'Arnel I. Robles',
  tags: ['javascript', 'tutorial', 'webdev'],
  categories: ['Tech'],
  image: '/logo.png',
  featured: false,
  draft: false,
  readingTime: 5, // estimated minutes
  source: 'local' as const
}
```

### Step 4: Build and Deploy

```bash
npm run docs:build
```

## Why Manual Registration?

The VitePress `createContentLoader` data loader was causing build issues with the current setup. This manual approach:

- ✅ Works reliably
- ✅ No build errors
- ✅ Full TypeScript support
- ✅ Easy to maintain

For a small personal blog (< 50 posts), manual registration is perfectly fine!

## Future Enhancement

If you want automatic post loading:
1. Move to a different SSG with better data loading
2. Create a build script that generates the composable automatically
3. Use a CMS with API integration

## Current Posts

- `2025-12-21-claude-code-improved-my-vitepress-blog.md` - Featured case study
- `2025-01-01-welcome-to-local-blog.md` - Example post

## Post Template

```markdown
---
title:
description:
date: YYYY-MM-DD
author: Arnel I. Robles
tags: []
categories: []
image: /logo.png
featured: false
draft: false
---

# Title

Introduction paragraph...

## Section 1

Content...

## Section 2

More content...
```

## Tips

1. **URLs**: Always match the filename (minus `.md`)
2. **Reading Time**: ~200 words per minute
3. **Excerpts**: First 1-2 sentences, max 150 characters
4. **Images**: Place in `docs/public/` and reference as `/image.png`
5. **Drafts**: Set `draft: true` to hide in production

Happy blogging! 🚀
