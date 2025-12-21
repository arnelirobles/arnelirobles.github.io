import { ref } from 'vue'
import type { BlogPost } from '../types/blog'

// Manually define local posts until data loader is fully integrated
// This is a temporary solution to avoid build issues with createContentLoader
export function useLocalPosts() {
  const posts = ref<BlogPost[]>([
    {
      title: 'How Claude Code Transformed My VitePress Blog for $1.86',
      description: 'A real-world case study of using AI pair programming to overhaul a blog\'s security, robustness, and user experience - bugs, fixes, and all.',
      date: '2025-12-21',
      url: '/blog/posts/2025-12-21-claude-code-improved-my-vitepress-blog',
      excerpt: 'As a developer from the Baryo, I\'m always looking for ways to improve my craft while being mindful of costs. When I heard about Claude Code, Anthropic\'s AI pair programming tool, I decided to put it to the test...',
      author: 'Arnel I. Robles',
      tags: ['AI', 'Claude Code', 'VitePress', 'DevOps', 'Security', 'Case Study'],
      categories: ['Tech'],
      image: '/logo.png',
      featured: true,
      draft: false,
      readingTime: 12,
      source: 'local' as const
    },
    {
      title: 'Welcome to Local Blog Posts',
      description: 'This is an example of a local blog post with frontmatter metadata. You can now write blog posts directly in markdown!',
      date: '2025-01-01',
      url: '/blog/posts/2025-01-01-welcome-to-local-blog',
      excerpt: 'This is an example blog post written directly in markdown with full frontmatter support. Now you can write blog posts locally without relying solely on Medium!',
      author: 'Arnel I. Robles',
      tags: ['announcement', 'blogging', 'markdown'],
      categories: ['News'],
      image: '/logo.png',
      featured: true,
      draft: false,
      readingTime: 5,
      source: 'local' as const
    }
  ])

  return { posts }
}
