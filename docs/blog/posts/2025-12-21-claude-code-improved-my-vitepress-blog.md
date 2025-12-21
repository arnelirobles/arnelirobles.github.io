---
title: How Claude Code Transformed My VitePress Blog for $1.86
description: A real-world case study of using AI pair programming to overhaul a blog's security, robustness, and user experience - bugs, fixes, and all.
date: 2025-12-21
author: Arnel I. Robles
tags: [AI, Claude Code, VitePress, DevOps, Security, Case Study]
categories: [Tech]
image: /logo.png
featured: true
draft: false
---

# How Claude Code Transformed My VitePress Blog for $1.86

As a developer from the Baryo, I'm always looking for ways to improve my craft while being mindful of costs. When I heard about Claude Code, Anthropic's AI pair programming tool, I decided to put it to the test with a real-world project: overhauling my VitePress blog.

**The Mission**: Make my blog more secure, robust, and blogger-friendly.

**The Cost**: $1.86 USD

**The Result**: A production-ready blog with enterprise-level security and features.

Here's the unfiltered story of what happened.

## The Starting Point

My blog was a basic VitePress setup pulling posts from Medium via RSS. It worked, but it had issues:

1. **XSS Vulnerability**: Raw HTML from Medium feeds rendered without sanitization
2. **No Error Handling**: Network failures meant a broken blog
3. **Limited Features**: No local blog posts, no SEO, no search
4. **UI Issues**: Content hidden behind the sidebar (spoiler: this became a problem)

I knew what needed fixing, but doing it manually would take hours. Time to see what Claude Code could do.

## The Prompt

I kept it simple:

> "Check the current code which is a VitePress and suggest code improvements to make it more robust, secured, and blogger friendly"

Then I said: **"ok implement"**

And Claude Code got to work.

## What Claude Code Did (The Good)

### 🔒 Security Overhaul

**XSS Protection**
- Installed and configured DOMPurify
- Sanitized all external HTML from Medium
- Configured strict whitelists for allowed tags

**Content Security Policy**
- Added comprehensive CSP headers
- X-Frame-Options for clickjacking protection
- X-XSS-Protection headers
- MIME-type sniffing prevention

**Secure Image Handling**
- Error handling with fallback images
- Lazy loading
- Proper CORS configuration

### 💪 Robustness Improvements

**Network Resilience**
- Retry logic with exponential backoff (3 attempts)
- 10-second request timeouts
- AbortController for proper cancellation
- User-friendly error messages

**Smart Caching**
- 1-hour cache for Medium posts
- LocalStorage with timestamp validation
- Automatic cache expiration
- Corrupted cache recovery

### ✍️ Blogger-Friendly Features

**Local Markdown Support**
Full frontmatter system:
```yaml
---
title: Your Post
description: What it's about
date: 2025-12-21
tags: [javascript, tutorial]
categories: [Tech]
featured: true
draft: false
---
```

**Combined Blog View**
- Shows both local and Medium posts
- Filter tabs (All/Local/Medium)
- Source badges
- Featured post highlighting

**SEO Optimization**
- Open Graph meta tags
- Twitter Cards
- Sitemap generation (automatic!)
- Robots.txt
- Built-in search

**Quality of Life**
- Custom 404 page
- Reading time calculation
- Draft mode for WIP posts
- Example post with documentation

## The Files Created

Claude Code created 15+ files in a single session:

```
New Components:
├── BlogList.vue (combined blog component)
├── blog.ts (TypeScript types)
├── blogUtils.ts (utility functions)
├── posts.data.ts (data loader)

Configuration:
├── config.mts (updated with SEO, security)
├── robots.txt
├── 404.md

Documentation:
├── IMPROVEMENTS.md (technical details)
├── IMPLEMENTATION_SUMMARY.md (what changed)
└── QUICK_START.md (how to use)
```

## The Bug (The Real World Strikes)

Everything built successfully. I ran `npm run docs:dev` and...

**The content was hidden behind the sidebar.**

The blog header and posts were being cut off by the left navigation. Classic CSS layout issue.

### The Fix Request

I simply told Claude:

> "the margin at the left, the text is hidden behind the tab in the left for tech, reflections etc"

Claude immediately understood and fixed it:

1. **Updated blog/index.md**
   - Added responsive padding calculations
   - Accounted for sidebar width on desktop
   - Proper mobile breakpoints

2. **Updated BlogList.vue**
   - Added `box-sizing: border-box`
   - Reduced padding on mobile
   - Made filter tabs wrap

**Second build**: ✅ Success. Layout fixed.

This is the real value of AI pair programming - when things break (and they will), you can iterate quickly without context switching.

## The Code Quality

I was impressed by several things:

1. **TypeScript Throughout**: Proper type definitions, no `any` types
2. **Security First**: DOMPurify config was production-ready
3. **Documentation**: Three markdown files explaining everything
4. **Example Code**: A complete example blog post showing proper frontmatter
5. **Responsive Design**: Mobile-first with proper breakpoints
6. **Error Recovery**: Graceful degradation when Medium is down

## The Cost Breakdown

**Total Cost**: $1.86 USD

This included:
- Initial analysis of the codebase
- Security vulnerability detection
- 15+ file modifications/creations
- Build testing
- Bug fix iteration
- Complete documentation

**What This Would Cost Me**:
- Manual implementation: 4-6 hours
- My hourly rate: Let's say $50/hour
- **Traditional cost: $200-300**

**ROI**: 16,000% 🚀

## What I Learned

### 1. AI Pair Programming Is Real
This wasn't just code generation. Claude Code:
- Analyzed my existing structure
- Made architectural decisions
- Caught security issues I might have missed
- Fixed bugs iteratively
- Documented everything

### 2. Be Specific About Your Goals
My prompt worked because I specified three clear goals:
- Security
- Robustness
- Blogger-friendly

Vague prompts get vague results.

### 3. Iteration Is Key
The sidebar bug is a perfect example. The first solution worked in theory but failed in practice. One simple message later, it was fixed.

### 4. Review Everything
I didn't blindly accept the code. I:
- Read through the security implementations
- Checked the TypeScript types
- Tested the build multiple times
- Verified the CSP headers

AI is a tool, not a replacement for understanding.

## The Dependencies Added

```json
{
  "@types/dompurify": "^3.0.5",
  "dompurify": "^3.3.1",
  "gray-matter": "^4.0.3",
  "isomorphic-dompurify": "^2.34.0",
  "vite-plugin-sitemap": "^0.8.2"
}
```

All well-maintained, security-focused packages.

## Before vs After

### Before
- ❌ XSS vulnerability
- ❌ No error handling
- ❌ Medium-only posts
- ❌ No SEO
- ❌ No search
- ❌ Generic 404s

### After
- ✅ Enterprise-level security
- ✅ Robust error handling with retries
- ✅ Local + Medium posts
- ✅ Full SEO (sitemap, OG tags, Twitter cards)
- ✅ Built-in search
- ✅ Custom 404 page
- ✅ Complete documentation

## Would I Do It Again?

**Absolutely.**

For less than the cost of a coffee in Manila, I got:
- Production-ready security
- Features I'd planned to build "someday"
- Complete documentation
- An educational experience

## Tips for Using Claude Code

1. **Start with a clear goal** - "make it better" is too vague
2. **Let it analyze first** - Give it time to understand your codebase
3. **Iterate on bugs** - Don't expect perfection on the first try
4. **Review the code** - AI is smart but not infallible
5. **Read the docs it creates** - Claude generates excellent documentation

## The Human Element

Here's the thing: Claude Code didn't replace me as a developer. It amplified me.

I still:
- Made the architectural decisions (by describing what I wanted)
- Reviewed every line of code
- Caught the layout bug through testing
- Understood the security implications

But I didn't have to:
- Look up DOMPurify documentation
- Configure CSP headers from scratch
- Write boilerplate TypeScript types
- Create example files
- Write three different documentation files

That's the sweet spot.

## Final Thoughts

AI pair programming isn't about replacing developers. It's about spending your time on what matters:

- Understanding the problem
- Making architectural decisions
- Testing and validation
- Learning from the implementation

For $1.86, I got a blog overhaul that would have taken me an entire evening. More importantly, I learned new patterns and approaches that I'll use in future projects.

## Try It Yourself

The complete implementation is available in my [GitHub repo](https://github.com/arnelirobles/arnelirobles.github.io). Check out:

- [IMPROVEMENTS.md](https://github.com/arnelirobles/arnelirobles.github.io/blob/master/IMPROVEMENTS.md) - Technical details
- [QUICK_START.md](https://github.com/arnelirobles/arnelirobles.github.io/blob/master/QUICK_START.md) - How to use the new features
- [IMPLEMENTATION_SUMMARY.md](https://github.com/arnelirobles/arnelirobles.github.io/blob/master/IMPLEMENTATION_SUMMARY.md) - What changed

## The Bottom Line

**Cost**: $1.86
**Time**: ~30 minutes (including bug fix)
**Value**: Immeasurable

This is the future of development. Not replacing developers, but making us more effective. And it's available to everyone, even developers from the Baryo.

---

*Want to see the results? You're reading them right now - this blog post is published on the improved system Claude Code built.*

**Update**: Build time is consistently 3-5 seconds. Everything works. Production deployment successful.

**P.S.** - The sidebar bug fix took exactly one sentence. That's the kind of productivity boost that makes AI pair programming worth it.

#AIAssisted #DevTools #VitePress #Security #OpenSource
