import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Index.vue'
import Login from '../views/auth/Login.vue'
import Customers from '../views/customers/Index.vue'
import Invoices from '../views/Invoices.vue'
import About from '../views/About.vue'
import store from '../store/Index.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      registerAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/email-verfication',
    name: 'email-verfication',
    component: () => import('../views/auth/email-verfication.vue'),
    meta: { title: 'Email Verfication' }
  },
  {
    path: '/reset-password/:id',
    name: 'reset-password',
    component: () => import('../views/auth/reset-password.vue'),
    meta: { title: 'Reset Password' }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: Invoices,
    meta: { title: 'Invoices', auth: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: Customers,
    meta: { title: 'Customers', auth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: 'About' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title

  if (to.meta.auth && !store.state.auth) {
    next('/login')
  } else {
    next()
  }
})
export default router
