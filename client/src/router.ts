import { createRouter, createWebHistory } from 'vue-router'
import LandingView from './views/LandingView.vue'
import ScannerView from './views/ScannerView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: LandingView
        },
        {
            path: '/scanner',
            name: 'scanner',
            component: ScannerView
        }
    ]
})

export default router
