import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import SingleDrawView from '@/views/SingleDrawView.vue'
import SpreadView from '@/views/SpreadView.vue'
import DrawView from '@/views/DrawView.vue'
import CardBoard from '@/views/CardBoard.vue'

const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/single', name: 'SingleDraw', component: SingleDrawView },
    { path: '/spread', name: 'Spread', component: SpreadView },
    { path: '/draw', name: 'Draw', component: DrawView },
    { path: '/simple-draw', redirect: '/spread' },
    { path: '/cards', name: 'AllCards', component: CardBoard },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
