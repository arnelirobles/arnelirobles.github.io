---
title: Welcome to Local Blog Posts
description: This is an example of a local blog post with frontmatter metadata. You can now write blog posts directly in markdown!
date: 2025-01-01
author: Arnel I. Robles
tags: [announcement, blogging, markdown]
categories: [News]
image: /logo.png
featured: false
draft: true
---

# Welcome to Local Blog Posts

This is an example blog post written directly in markdown with full frontmatter support. Now you can write blog posts locally without relying solely on Medium!

## Features

### Rich Frontmatter Support

Every blog post supports comprehensive metadata:

- **Title & Description**: SEO-optimized metadata
- **Author**: Customize the author name
- **Tags & Categories**: Organize your content
- **Featured Image**: Add custom images to your posts
- **Draft Mode**: Hide posts until they're ready
- **Reading Time**: Auto-calculated based on content

### Why Local Posts?

1. **Full Control**: Own your content completely
2. **Version Control**: Track changes with Git
3. **Markdown Power**: Use all markdown features
4. **Offline Writing**: No internet needed
5. **Fast Publishing**: Just commit and push

### How to Create a New Post

Create a new markdown file in `docs/blog/posts/` with this frontmatter:

```markdown
---
title: Your Post Title
description: A brief description of your post
date: 2025-01-01
author: Your Name
tags: [tag1, tag2, tag3]
categories: [Category]
image: /path/to/image.png
featured: false
draft: false
---

Your content here...
```

### Combined with Medium

This system works alongside your Medium posts! The blog page will show:

- Local markdown posts (with full control)
- Medium posts (via RSS feed)
- All sorted by date, newest first

## Technical Details

This implementation includes:

- **TypeScript Types**: Full type safety for blog metadata
- **Data Loaders**: VitePress content loader for efficient builds
- **Utilities**: Helper functions for filtering, sorting, and formatting
- **Security**: HTML sanitization for external content
- **Performance**: Smart caching and lazy loading

## Next Steps

1. Create more posts in `docs/blog/posts/`
2. Customize the frontmatter to your needs
3. Add your own categories and tags
4. Share your knowledge with the world!

Happy blogging from the Baryo!
