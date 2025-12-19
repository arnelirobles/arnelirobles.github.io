import { defineConfig } from 'vitepress'

export default defineConfig({
    title: "BaryoDev",
    description: "Developer from the Barrio - A mix of tech, reflections, news, and literary writing",
    head: [['link', { rel: 'icon', href: '/logo.png' }]],
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
                    ]
                }
            ]
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/arnelirobles' }
        ],
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2025-present Arneli Robles'
        }
    }
})
