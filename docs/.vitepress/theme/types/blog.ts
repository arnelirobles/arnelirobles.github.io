export interface BlogPostFrontmatter {
  title: string
  description: string
  date: string
  author?: string
  tags?: string[]
  categories?: string[]
  image?: string
  featured?: boolean
  draft?: boolean
  readingTime?: number
}

export interface BlogPost {
  title: string
  description: string
  date: string
  url: string
  excerpt?: string
  content?: string
  author?: string
  tags?: string[]
  categories?: string[]
  image?: string
  featured?: boolean
  draft?: boolean
  readingTime?: number
  source: 'local' | 'medium'
}

export interface BlogPostMetadata {
  frontmatter: BlogPostFrontmatter
  url: string
  filePath: string
}
