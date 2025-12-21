import DefaultTheme from 'vitepress/theme'
import type { App } from 'vue'
import './custom.css'
import MediumBlog from './components/MediumBlog.vue'
import BlogList from './components/BlogList.vue'

export default {
    extends: DefaultTheme,
    enhanceApp({ app }: { app: App }) {
        app.component('MediumBlog', MediumBlog)
        app.component('BlogList', BlogList)
    }
}
