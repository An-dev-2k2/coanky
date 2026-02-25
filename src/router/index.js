import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: 'active',
})
router.beforeEach((to, from, next) => {
  const userToken = sessionStorage.getItem('token')
  const adminToken = sessionStorage.getItem('adminToken')

  const isMobile = window.innerWidth < 640
  if (isMobile && to.meta.mobileOnly) {
    to.matched[0].components.default = to.matched[0].children[0].component
  }
  // store.dispatch("setup/setLoading", true)
  if (to.matched.some((record) => record.meta.authRequired)) {
    if (to.path.startsWith('/admin')) {
      if (!adminToken) {
        return next('/admin/login')
      }
    } else {
      if (!userToken) {
        return next({ path: '/login', query: { redirect: to.fullPath } })
      }
    }
  }
  next()
})

router.afterEach((to) => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
  document.title = to.meta.title || 'Cổ Ấn Ký'
})
export default router
