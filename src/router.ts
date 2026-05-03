import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DrawTarotView from '@/views/DrawTarotView.vue'
import TarotCardBoard from '@/views/TarotCardBoard.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/draw', name: 'Draw', component: DrawTarotView },
    { path: '/cards', name: 'AllCards', component: TarotCardBoard },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
