import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DrawView from '@/views/DrawView.vue'
import CardBoard from '@/views/CardBoard.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/draw', name: 'Draw', component: DrawView },
    { path: '/cards', name: 'AllCards', component: CardBoard },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
