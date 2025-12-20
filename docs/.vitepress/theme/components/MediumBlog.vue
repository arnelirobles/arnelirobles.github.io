<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

interface BlogPost {
  title: string
  pubDate: string
  link: string
  thumbnail: string
  description: string
  content: string
  categories: string[]
  author: string
}

interface RssResponse {
  status: string
  items: BlogPost[]
}

const posts = ref<BlogPost[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedPost = ref<BlogPost | null>(null)

const MEDIUM_RSS_URL = 'https://medium.com/feed/@BaryoDev'
// Cache-bust every hour to get fresh content
const getCacheBuster = () => Math.floor(Date.now() / (60 * 60 * 1000))
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}&_cb=${getCacheBuster()}`

const isDetailView = computed(() => selectedPost.value !== null)

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

const getThumbnail = (post: BlogPost): string | null => {
  if (post.thumbnail) return post.thumbnail
  return getImageFromHtml(post.content || post.description)
}

const getExcerpt = (description: string, maxLength = 120): string => {
  const text = stripHtml(description)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

const openPost = (post: BlogPost) => {
  selectedPost.value = post
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const closePost = () => {
  selectedPost.value = null
}

const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Failed to fetch posts')
    
    const data: RssResponse = await response.json()
    if (data.status !== 'ok') throw new Error('Invalid RSS response')
    
    posts.value = data.items
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load blog posts'
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>

<template>
  <div class="medium-blog">
    <!-- Detail View -->
    <div v-if="isDetailView && selectedPost" class="blog-detail">
      <button @click="closePost" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Blog
      </button>
      
      <article class="detail-article">
        <header class="detail-header">
          <div class="detail-meta">
            <span class="detail-date">{{ formatDate(selectedPost.pubDate) }}</span>
            <span class="detail-author" v-if="selectedPost.author">by {{ selectedPost.author }}</span>
          </div>
          <h1 class="detail-title">{{ selectedPost.title }}</h1>
          <div class="detail-tags" v-if="selectedPost.categories?.length">
            <span v-for="tag in selectedPost.categories" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>
        
        <div class="detail-content" v-html="selectedPost.content || selectedPost.description"></div>
        
        <footer class="detail-footer">
          <a :href="selectedPost.link" target="_blank" rel="noopener noreferrer" class="read-at-medium">
            <svg class="medium-icon" viewBox="0 0 1043.63 592.71" width="24" height="24">
              <g><path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 278.99-147.17 278.99-81.27 0-147.17-124.93-147.17-278.99 0-154.05 65.9-278.99 147.17-278.99 81.28 0 147.17 124.94 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94-28.59 0-51.76-111.91-51.76-249.94 0-138 23.17-249.94 51.76-249.94 28.59 0 51.76 111.9 51.76 249.94"/></g>
            </svg>
            Read at Medium
          </a>
        </footer>
      </article>
    </div>

    <!-- List View -->
    <div v-else>
      <!-- Loading State -->
      <div v-if="loading" class="blog-loading">
        <div class="loading-spinner"></div>
        <p>Loading posts from Medium...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="blog-error">
        <p>{{ error }}</p>
        <button @click="fetchPosts" class="retry-btn">Try Again</button>
      </div>

      <!-- Posts Grid -->
      <div v-else class="blog-grid">
        <div 
          v-for="post in posts" 
          :key="post.link" 
          class="blog-card"
          @click="openPost(post)"
        >
          <div class="card-image" v-if="getThumbnail(post)">
            <img :src="getThumbnail(post)!" :alt="post.title" loading="lazy" />
          </div>
          <div class="card-content">
            <div class="card-meta">
              <span class="card-date">{{ formatDate(post.pubDate) }}</span>
            </div>
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-excerpt">{{ getExcerpt(post.description) }}</p>
            <div class="card-tags" v-if="post.categories?.length">
              <span 
                v-for="tag in post.categories.slice(0, 3)" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <!-- Medium Logo Badge -->
          <div class="source-badge" title="From Medium">
            <svg class="medium-icon" viewBox="0 0 1043.63 592.71" width="20" height="20">
              <g><path d="M588.67 296.36c0 163.67-131.78 296.35-294.33 296.35S0 460 0 296.36 131.78 0 294.34 0s294.33 132.69 294.33 296.36M911.56 296.36c0 154.06-65.89 278.99-147.17 278.99-81.27 0-147.17-124.93-147.17-278.99 0-154.05 65.9-278.99 147.17-278.99 81.28 0 147.17 124.94 147.17 279M1043.63 296.36c0 138-23.17 249.94-51.76 249.94-28.59 0-51.76-111.91-51.76-249.94 0-138 23.17-249.94 51.76-249.94 28.59 0 51.76 111.9 51.76 249.94"/></g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.medium-blog {
  padding: 1rem 3rem;
}

/* Detail View Styles */
.blog-detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.detail-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.detail-content {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--vp-c-text-1);
}

.detail-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.detail-content :deep(pre) {
  background: var(--vp-c-bg-soft);
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
}

.detail-content :deep(code) {
  background: var(--vp-c-bg-soft);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.detail-content :deep(blockquote) {
  border-left: 4px solid var(--vp-c-brand-1);
  padding-left: 1rem;
  margin: 1.5rem 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.detail-content :deep(h2),
.detail-content :deep(h3),
.detail-content :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.detail-content :deep(p) {
  margin: 1rem 0;
}

.detail-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.detail-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
  text-align: center;
}

.read-at-medium {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: #000;
  color: #fff;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.read-at-medium:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.read-at-medium .medium-icon {
  fill: #fff;
}

/* List View Styles */
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

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-meta {
  margin-bottom: 0.5rem;
}

.card-date {
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

/* Medium Badge */
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

/* Responsive */
@media (max-width: 1024px) {
  .blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-title {
    font-size: 1.5rem;
  }
}
</style>
