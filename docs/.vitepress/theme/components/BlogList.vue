<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import type { BlogPost } from '../types/blog'
import DOMPurify from 'isomorphic-dompurify'
import { useLocalPosts } from '../composables/useLocalPosts'

// Load local posts
const { posts: localPostsRef } = useLocalPosts()
const localPosts = localPostsRef.value

interface MediumPost {
  title: string
  pubDate: string
  link: string
  thumbnail: string
  description: string
  content: string
  categories: string[]
  author: string
}

const router = useRouter()
const mediumPosts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedFilter = ref<'all' | 'local' | 'medium'>('all')

const MEDIUM_RSS_URL = 'https://medium.com/feed/@BaryoDev'
const API_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(MEDIUM_RSS_URL)}`
const CACHE_KEY = 'medium_posts_cache'
const CACHE_DURATION = 60 * 60 * 1000
const MAX_RETRIES = 3
const RETRY_DELAY = 2000

interface CachedData {
  posts: BlogPost[]
  timestamp: number
}

const allPosts = computed(() => {
  const combined = [...localPosts, ...mediumPosts.value]
  const filtered = selectedFilter.value === 'all'
    ? combined
    : combined.filter(p => p.source === selectedFilter.value)

  return filtered.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
})

const localPostsCount = computed(() => localPosts.length)
const mediumPostsCount = computed(() => mediumPosts.value.length)
const totalPostsCount = computed(() => localPostsCount.value + mediumPostsCount.value)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/logo.png'
  img.onerror = null
}

const navigateToPost = (post: BlogPost) => {
  if (post.source === 'local') {
    router.go(post.url)
  } else {
    window.open(post.url, '_blank', 'noopener,noreferrer')
  }
}

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u'],
    ALLOWED_ATTR: []
  })
}

const stripHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}

const getImageFromHtml = (html: string): string | null => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const img = doc.querySelector('img')
  return img?.getAttribute('src') || null
}

const getExcerpt = (description: string, maxLength = 120): string => {
  const text = stripHtml(description)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

const parseRssXml = (xmlString: string): MediumPost[] => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(xmlString, 'text/xml')
  const items = xml.querySelectorAll('item')

  return Array.from(items).map(item => {
    const getTextContent = (tag: string) => item.querySelector(tag)?.textContent || ''
    const categories = Array.from(item.querySelectorAll('category')).map(c => c.textContent || '')

    const content = item.querySelector('content\\:encoded')?.textContent ||
                   item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent ||
                   getTextContent('description')

    return {
      title: getTextContent('title'),
      pubDate: getTextContent('pubDate'),
      link: getTextContent('link'),
      thumbnail: '',
      description: getTextContent('description'),
      content: content,
      categories: categories,
      author: getTextContent('dc\\:creator') || item.getElementsByTagNameNS('*', 'creator')[0]?.textContent || 'BaryoDev'
    }
  })
}

const convertMediumToBlogPost = (mediumPost: MediumPost): BlogPost => {
  const thumbnail = mediumPost.thumbnail || getImageFromHtml(mediumPost.content || mediumPost.description)

  return {
    title: mediumPost.title,
    description: sanitizeHtml(mediumPost.description),
    date: mediumPost.pubDate,
    url: mediumPost.link,
    excerpt: getExcerpt(mediumPost.description),
    author: mediumPost.author,
    tags: mediumPost.categories,
    categories: mediumPost.categories,
    image: thumbnail || undefined,
    featured: false,
    draft: false,
    source: 'medium'
  }
}

const getCachedPosts = (): BlogPost[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const data: CachedData = JSON.parse(cached)
    const now = Date.now()

    if (now - data.timestamp < CACHE_DURATION) {
      return data.posts
    }

    localStorage.removeItem(CACHE_KEY)
    return null
  } catch {
    return null
  }
}

const setCachedPosts = (postsData: BlogPost[]) => {
  try {
    const data: CachedData = {
      posts: postsData,
      timestamp: Date.now()
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Ignore localStorage errors
  }
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const fetchWithRetry = async (url: string, retries = MAX_RETRIES): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (response.ok) return response

      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }
    } catch (e) {
      if (i === retries - 1) throw e
      await sleep(RETRY_DELAY * (i + 1))
    }
  }
  throw new Error('Max retries exceeded')
}

const fetchMediumPosts = async () => {
  try {
    loading.value = true
    error.value = null

    const cachedPosts = getCachedPosts()
    if (cachedPosts && cachedPosts.length > 0) {
      mediumPosts.value = cachedPosts
      loading.value = false
      return
    }

    const response = await fetchWithRetry(API_URL)
    const xmlText = await response.text()
    const parsedPosts = parseRssXml(xmlText)

    mediumPosts.value = parsedPosts.map(convertMediumToBlogPost)
    setCachedPosts(mediumPosts.value)
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : 'Failed to load Medium posts'
    error.value = errorMessage.includes('aborted')
      ? 'Request timed out. Check your connection and try again.'
      : errorMessage
    console.error('Failed to fetch Medium posts:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchMediumPosts)
</script>

<template>
  <div class="blog-list">
    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button
        :class="{ active: selectedFilter === 'all' }"
        @click="selectedFilter = 'all'"
      >
        All Posts ({{ totalPostsCount }})
      </button>
      <button
        :class="{ active: selectedFilter === 'local' }"
        @click="selectedFilter = 'local'"
      >
        Local Posts ({{ localPostsCount }})
      </button>
      <button
        :class="{ active: selectedFilter === 'medium' }"
        @click="selectedFilter = 'medium'"
      >
        Medium Posts ({{ mediumPostsCount }})
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading && mediumPosts.length === 0" class="blog-loading">
      <div class="loading-spinner"></div>
      <p>Loading posts from Medium...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="blog-error">
      <p>{{ error }}</p>
      <button @click="fetchMediumPosts" class="retry-btn">Try Again</button>
    </div>

    <!-- Posts Grid -->
    <div class="blog-grid">
      <article
        v-for="post in allPosts"
        :key="post.url"
        class="blog-card"
        @click="navigateToPost(post)"
      >
        <div class="card-image">
          <img
            :src="post.image || '/logo.png'"
            :alt="post.title"
            loading="lazy"
            @error="handleImageError"
          />
          <div v-if="post.featured" class="featured-badge">Featured</div>
        </div>
        <div class="card-content">
          <div class="card-meta">
            <span class="card-date">{{ formatDate(post.date) }}</span>
            <span v-if="post.readingTime" class="reading-time">{{ post.readingTime }} min read</span>
          </div>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-excerpt">{{ post.excerpt || post.description }}</p>
          <div class="card-tags" v-if="post.tags?.length">
            <span
              v-for="tag in post.tags.slice(0, 3)"
              :key="tag"
              class="tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="source-badge" :title="`From ${post.source === 'local' ? 'Local' : 'Medium'}`">
          <svg v-if="post.source === 'medium'" class="medium-icon" viewBox="0 0 1043.63 592.71" width="20" height="20">
            <g><path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 278.99-147.17 278.99-81.27 0-147.17-124.93-147.17-278.99 0-154.05 65.9-278.99 147.17-278.99 81.28 0 147.17 124.94 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94-28.59 0-51.76-111.91-51.76-249.94 0-138 23.17-249.94 51.76-249.94 28.59 0 51.76 111.9 51.76 249.94"/></g>
          </svg>
          <svg v-else class="local-icon" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.blog-list {
  padding: 1rem 3rem;
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 959px) {
  .blog-list {
    padding: 1rem 1.5rem;
  }
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-wrap: wrap;
}

.filter-tabs button {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.filter-tabs button:hover {
  color: var(--vp-c-text-1);
}

.filter-tabs button.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.blog-loading,
.blog-error {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--vp-c-text-2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.retry-btn:hover {
  opacity: 0.9;
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.blog-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--vp-c-divider);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.blog-card:hover .card-image img {
  transform: scale(1.05);
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.25rem 0.75rem;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-date,
.reading-time {
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
}

.card-excerpt {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 20px;
  font-weight: 500;
}

.source-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  background: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.source-badge .medium-icon {
  fill: #000;
}

.source-badge .local-icon {
  color: var(--vp-c-brand-1);
}

@media (max-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .blog-list {
    padding: 1rem;
  }

  .blog-grid {
    grid-template-columns: 1fr;
  }

  .filter-tabs {
    flex-direction: column;
  }

  .filter-tabs button {
    text-align: left;
  }
}
</style>
