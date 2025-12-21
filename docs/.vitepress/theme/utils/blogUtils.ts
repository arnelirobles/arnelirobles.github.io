import { createContentLoader } from 'vitepress'
import type { ContentData } from 'vitepress'
import type { BlogPost, BlogPostFrontmatter } from '../types/blog'

/**
 * Calculate estimated reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 150): string {
  const text = content
    .replace(/^#.*$/gm, '') // Remove headers
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to plain text
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .trim()

  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Sort posts by date (newest first)
 */
export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

/**
 * Filter out draft posts in production
 */
export function filterDrafts(posts: BlogPost[], includeDrafts = false): BlogPost[] {
  if (includeDrafts) return posts
  return posts.filter(post => !post.draft)
}

/**
 * Get posts by tag
 */
export function getPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.tags?.includes(tag))
}

/**
 * Get posts by category
 */
export function getPostsByCategory(posts: BlogPost[], category: string): BlogPost[] {
  return posts.filter(post => post.categories?.includes(category))
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>()
  posts.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags).sort()
}

/**
 * Get all unique categories from posts
 */
export function getAllCategories(posts: BlogPost[]): string[] {
  const categories = new Set<string>()
  posts.forEach(post => {
    post.categories?.forEach(category => categories.add(category))
  })
  return Array.from(categories).sort()
}

/**
 * Convert VitePress ContentData to BlogPost
 */
export function contentDataToBlogPost(data: ContentData): BlogPost {
  const frontmatter = data.frontmatter as BlogPostFrontmatter
  const excerpt = frontmatter.description || generateExcerpt(data.excerpt || '', 150)

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    url: data.url,
    excerpt,
    author: frontmatter.author || 'Arnel I. Robles',
    tags: frontmatter.tags || [],
    categories: frontmatter.categories || [],
    image: frontmatter.image,
    featured: frontmatter.featured || false,
    draft: frontmatter.draft || false,
    readingTime: frontmatter.readingTime || calculateReadingTime(data.excerpt || ''),
    source: 'local'
  }
}

/**
 * Create a content loader for blog posts
 * Usage in .vitepress/config.ts or data loaders
 */
export function createBlogPostLoader(pattern: string) {
  return createContentLoader(pattern, {
    includeSrc: false,
    render: false,
    excerpt: true,
    transform(rawData): BlogPost[] {
      const posts = rawData
        .map(contentDataToBlogPost)
        .filter(post => !post.draft || import.meta.env.DEV)

      return sortPostsByDate(posts)
    }
  })
}
