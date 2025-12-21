import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    sitemap: {
        hostname: 'https://arnelirobles.github.io'
    },
    title: "Arnel I. Robles",
    description: "Personal blog, Open Source, and Full Stack Development from the Baryo",
    head: [
        ['link', { rel: 'icon', href: '/logo.png' }],
        ['meta', { name: 'author', content: 'Arnel I. Robles' }],
        ['meta', { name: 'keywords', content: 'software development, open source, full stack, BaryoDev, programming, tech blog' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: 'Arnel I. Robles - Full Stack Developer' }],
        ['meta', { property: 'og:description', content: 'Personal blog, Open Source, and Full Stack Development from the Baryo' }],
        ['meta', { property: 'og:image', content: '/logo.png' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:title', content: 'Arnel I. Robles - Full Stack Developer' }],
        ['meta', { name: 'twitter:description', content: 'Personal blog, Open Source, and Full Stack Development from the Baryo' }],
        ['meta', { name: 'twitter:image', content: '/logo.png' }],
        ['meta', { 'http-equiv': 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https: http:; font-src 'self' data: https:; connect-src 'self' https://api.allorigins.win https://medium.com; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';" }],
        ['meta', { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' }],
        ['meta', { 'http-equiv': 'X-Frame-Options', content: 'SAMEORIGIN' }],
        ['meta', { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }],
        ['meta', { name: 'referrer', content: 'strict-origin-when-cross-origin' }]
    ],
    appearance: false,
    vite: {
        plugins: [
            VitePWA({
                registerType: 'autoUpdate',
                includeAssets: ['logo.png'],
                manifest: {
                    name: 'Arnel I. Robles',
                    short_name: 'Arnel Robles',
                    description: 'Personal blog, Open Source, and Full Stack Development from the Baryo',
                    theme_color: '#ffffff',
                    icons: [
                        {
                            src: 'logo.png',
                            sizes: '192x192',
                            type: 'image/png'
                        },
                        {
                            src: 'logo.png',
                            sizes: '512x512',
                            type: 'image/png'
                        }
                    ]
                }
            })
        ]
    },
    themeConfig: {
        logo: '/logo.png',
        search: {
            provider: 'local',
            options: {
                detailedView: true,
                miniSearch: {
                    searchOptions: {
                        fuzzy: 0.2,
                        prefix: true,
                        boost: {
                            title: 4,
                            text: 2,
                            titles: 1
                        }
                    }
                }
            }
        },
        nav: [
            { text: 'Home', link: '/' },
            { text: 'Blog', link: '/blog/' },
            { text: 'Tech', link: '/tech/' },
            { text: 'Reflections', link: '/reflections/' },
            { text: 'News', link: '/news/' },
            { text: 'Literary', link: '/literary/' },
        ],
        sidebar: {
            '/tech/': [
                {
                    text: 'Tech Articles',
                    items: [
                        { text: 'Introduction', link: '/tech/' },
                        // Add more items here
                    ]
                }
            ],
            '/reflections/': [
                {
                    text: 'Reflections',
                    items: [
                        { text: 'Introduction', link: '/reflections/' },
                    ]
                }
            ],
            '/news/': [
                {
                    text: 'News & Updates',
                    items: [
                        { text: 'Introduction', link: '/news/' },
                    ]
                }
            ],
            '/literary/': [
                {
                    text: 'Literary Writing',
                    items: [
                        { text: 'Introduction', link: '/literary/' },
                        { text: 'Podcast', link: '/literary/podcast' },
                    ]
                }
            ]
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025 Arnel I. Robles'
        }
    }
})
