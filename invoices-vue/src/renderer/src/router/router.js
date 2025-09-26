import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Index.vue'
import Login from '../views/auth/Login.vue'
import store from '../store/store.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home', auth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Login' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue'),
    meta: { title: 'Email Verfication' }
  },
  {
    path: '/email-verfication',
    name: 'email-verfication',
    component: () => import('../views/auth/Email-Verfication.vue'),
    meta: { title: 'Email Verfication' }
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: () => import('../views/auth/Reset-Password.vue'),
    meta: { title: 'Reset Password' }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/settings/Profile.vue'),
    meta: { title: 'Profile' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('../views/settings/Settings.vue'),
    meta: { title: 'Settings' }
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: () => import('../views/Invoices.vue'),
    meta: { title: 'Invoices', auth: true }
  },
  {
    path: '/customer-list',
    name: 'Customers',
    component: () => import('../views/customers/CustomerList.vue'),
    meta: { title: 'Customers', auth: true }
  },
  {
    path: '/customer-new',
    name: 'CustomerNew',
    component: () => import('../views/customers/CustomerNew.vue'),
    meta: { title: 'Add New Customer', auth: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
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
