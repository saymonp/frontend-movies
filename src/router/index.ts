import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TailTest from '@/views/TailTest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //{
    //  path: '/',
    //  name: 'home',
    //  component: HomeView,
    //},
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/tailwind',
      name: 'tailwind',
      component: TailTest,
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/:lang/filme/:slug', // O :lang vira um parâmetro (br ou en)
      name: 'MovieView',
      component: () => import('../views/MovieView.vue'),
      props: true
    }
  ],
})

export default router
