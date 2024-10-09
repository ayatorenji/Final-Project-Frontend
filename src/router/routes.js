
const routes = [
  {
    path: '/',
    redirect: '/pet', 
  },

  {
    path: '/mainpage',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
    ]
  },

  {
    path: '/main',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/register', component: () => import('pages/RegisterPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
    ]
  },

  {
    path: '/content',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/post', component: () => import('pages/PostPage.vue') },
      { path: '/dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: '/pet', component: () => import('pages/AnimalPage.vue') },
      { path: '/map', component: () => import('pages/MapPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
