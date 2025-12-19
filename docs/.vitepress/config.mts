import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    title: "Arnel I. Robles",
    description: "Personal blog, Open Source, and Full Stack Development from the Baryo",
    head: [['link', { rel: 'icon', href: '/logo.png' }]],
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
        nav: [
            { text: 'Home', link: '/' },
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
