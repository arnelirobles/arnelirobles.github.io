import { createContentLoader } from 'vitepress'
import type { ContentData } from 'vitepress'
import type { BlogPost, BlogPostFrontmatter } from '../types/blog'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function generateExcerpt(content: string, maxLength = 150): string {
  const text = content
    .replace(/^#.*$/gm, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim()

  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export default createContentLoader('blog/posts/**/*.md', {
  includeSrc: false,
  render: false,
  excerpt: true,
  transform(rawData: ContentData[]): BlogPost[] {
    const posts = rawData.map((data): BlogPost => {
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
        source: 'local' as const
      }
    })

    // Filter drafts in production
    const filteredPosts = posts.filter(post => !post.draft || process.env.NODE_ENV === 'development')

    // Sort by date (newest first)
    return filteredPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  }
})

declare const data: BlogPost[]
export { data }
