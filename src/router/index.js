import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home/index'),
    redirect: '/student',
    children: [
      {
        path: '/student',
        name: 'student',
        component: () => import('@/components/student/index')
      },
      {
        path: '/seat',
        name: 'seat',
        component: () => import('@/components/seat/index')
      },
      {
        path: '/reservationLog',
        name: 'reservationLog',
        component: () => import('@/components/reservationLog/index')
      },
      {
        path: '/checkinLog',
        name: 'reservationLog',
        component: () => import('@/components/checkinLog/index')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})


router.beforeEach((to, from, next) => {
  if (to.path === '/') return next()
  let library_token = localStorage.getItem("library_token");
  if (!library_token) return next("/")
  next()
})

export default router
