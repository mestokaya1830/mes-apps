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

  //user

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
    meta: { title: 'Register' }
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
    meta: { title: 'Profile', auth: true }
  },
  {
    path: '/edit-user',
    name: 'edit-user',
    component: () => import('../views/settings/EditUser.vue'),
    meta: { title: 'Edit User', auth: true }
  },

  //invoices

  {
    path: '/invoices',
    name: 'invoices',
    component: () => import('../views/invoices/Index.vue'),
    meta: { title: 'Invoices', auth: true }
  },
  {
    path: '/invoices/create',
    name: 'invoices-create',
    component: () => import('../views/invoices/Create.vue'),
    meta: { title: 'Add New Offer', auth: true }
  },
  {
    path: '/invoices/details/:id',
    name: 'invoices-details',
    component: () => import('../views/invoices/Details.vue'),
    meta: { title: 'Offer Details', auth: true }
  },

  //orrders

  {
    path: '/orders',
    name: 'orders',
    component: () => import('../views/orders/Index.vue'),
    meta: { title: 'Orders', auth: true }
  },
  {
    path: '/orders/create',
    name: 'orders-create',
    component: () => import('../views/orders/Create.vue'),
    meta: { title: 'Add New Order', auth: true }
  },
  {
    path: '/orders/details/:id',
    name: 'orders-details',
    component: () => import('../views/orders/Details.vue'),
    meta: { title: 'Order Details', auth: true }
  },

  //offers

  {
    path: '/offers',
    name: 'offers',
    component: () => import('../views/offers/Index.vue'),
    meta: { title: 'Offers', auth: true }
  },
  {
    path: '/offers/create',
    name: 'offers-create',
    component: () => import('../views/offers/Create.vue'),
    meta: { title: 'Add New Offer', auth: true }
  },
  {
    path: '/offers/details/:id',
    name: 'offers-details',
    component: () => import('../views/offers/Details.vue'),
    meta: { title: 'Offer Details', auth: true }
  },

  //delivery

  {
    path: '/delivery',
    name: 'delivery',
    component: () => import('../views/delivery/Index.vue'),
    meta: { title: 'Devliver', auth: true }
  },
  {
    path: '/delivery/create',
    name: 'delivery-create',
    component: () => import('../views/delivery/Create.vue'),
    meta: { title: 'Add New Delivery', auth: true }
  },
  {
    path: '/delivery/details/:id',
    name: 'delivery-details',
    component: () => import('../views/delivery/Details.vue'),
    meta: { title: 'Delivery Details', auth: true }
  },

  //customers

  {
    path: '/customers',
    name: 'customers',
    component: () => import('../views/customers/Index.vue'),
    meta: { title: 'Customers', auth: true }
  },
  {
    path: '/customers/create',
    name: 'customers-create',
    component: () => import('../views/customers/Create.vue'),
    meta: { title: 'Add New Customer', auth: true }
  },
  {
    path: '/customers/details/:id',
    name: 'customers-details',
    component: () => import('../views/customers/Details.vue'),
    meta: { title: 'Customer Details', auth: true }
  },

  //about

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
  // next()
  if (to.meta.auth && !store.state.auth) {
    next('/login')
  } else {
    next()
  }
})
export default router
