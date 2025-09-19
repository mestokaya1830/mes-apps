import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Index.vue'
import Login from '../views/Login.vue'
import Customers from '../views/customers/Index.vue'
import Invoices from '../views/Invoices.vue'
import About from '../views/About.vue'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
  { path: '/login', name: 'Login', component: Login, meta: { title: 'Login' } },
  { path: '/invoices', name: 'Invoices', component: Invoices, meta: { title: 'Invoices' } },
  { path: '/customers', name: 'Customers', component: Customers, meta: { title: 'Customers' } },
  { path: '/about', name: 'About', component: About, meta: { title: 'About' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'active',
  linkExactActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
export default router
