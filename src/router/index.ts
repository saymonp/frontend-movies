import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    //{
    //  path: '/',
    //  name: 'home',
    //  component: HomeView,
    //},
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
    },
    {
      path: '/lista/:id-:slug',
      name: 'ListView',
      component: () => import('../views/ListView.vue'),
      props: true
    },
    {
      path: '/lista/criar',
      name: 'CreateListView',
      component: () => import('../views/CreateListView.vue'),
      props: true
    },
    {
      path: '/perfil', // O :lang vira um parâmetro (br ou en)
      name: 'PerfilView',
      component: () => import('../views/PerfilView.vue'),
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/auth/success',
      component: () => import('../views/AuthSuccess.vue'),
    },
    {
      path: '/administrador',
      name: 'AdminView',
      component: () => import('../views/AdminView.vue'),
      // Marcamos que esta rota exige autenticação E nível de admin
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/termos',
      name: 'Termos',
      component: () => import('../views/Termos.vue')
    },
    {
      path: '/privacidade',
      name: 'Privacidade',
      component: () => import('../views/Privacidade.vue')
    },
    {
      path: '/recuperar-senha',
      name: 'SolicitarRecuperarSenha',
      component: () => import('../views/SolicitarRecuperarSenhaView.vue')
    },
    {
      path: '/reset-password',
      name: 'RedefinirSenha',
      component: () => import('../views/RedefinirSenhaView.vue')
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // Se o usuário clicar em "Voltar", ele mantém a posição anterior (opcional)
    if (savedPosition) {
      return savedPosition;
    } else {
      // Para qualquer outra navegação, vai para o topo
      return { top: 0 };
    }
  },

});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 1. Verificar se a rota exige autenticação
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // 2. Verificar se a rota exige nível de administrador
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Caso A: A rota exige login e o usuário não tem token
  if (requiresAuth && !auth.token) {
    return next('/'); // Ou sua rota de login/modal
  }

  // Caso B: A rota exige Admin, mas o usuário logado não é admin
  // Usamos .includes() ou a lógica de roles que você definiu no store
  if (requiresAdmin && !auth.user?.roles.includes('admin')) {
    console.warn("Acesso negado: Usuário não é administrador.");
    return next('/'); // Redireciona para a home
  }

  // Caso C: Tudo ok ou rota pública
  next();
});

export default router
