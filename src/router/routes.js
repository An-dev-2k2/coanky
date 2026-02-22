import Default from '@/views/Layouts/Default.vue'
import Admin from '@/views/Layouts/Admin.vue'

const routes = [
  {
    path: '/',
    meta: {
      authRequired: false,
      title: 'Trang chủ',
    },
    component: Default,
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: 'Trang chủ',
        },
        component: () => import('@/views/Home.vue'),
      },
    ],
  },
  //admim
  {
    path: '/admin/login',
    name: 'login',
    meta: {
      title: 'Đăng nhập',
      authRequired: false,
    },
    component: () => import('@/views/Admin/Login.vue'),
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: 'Trang quản trị',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Dashboard.vue'),
      },
      {
        path: 'tours',
        name: 'tours',
        meta: {
          title: 'Danh sách tour',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Tours.vue'),
      },
      {
        path: 'tours/create',
        name: 'tours-create',
        meta: {
          title: 'Thêm tour',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Tours/Create.vue'),
      },
      {
        path: 'icons',
        name: 'icons',
        meta: {
          title: 'Danh sách Ấn Ký',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Icons.vue'),
      },
      {
        path: 'orders',
        name: 'orders',
        meta: {
          title: 'Danh sách đơn hàng',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Orders.vue'),
      },
      {
        path: 'users',
        name: 'users',
        meta: {
          title: 'Danh sách người dùng',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Users.vue'),
      },
      {
        path: 'transactions',
        name: 'transactions',
        meta: {
          title: 'Lịch sử giao dịch',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Transactions.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          title: 'Cài đặt',
          authRequired: false,
        },
        component: () => import('@/views/Admin/Settings.vue'),
      },
    ],
  },
]

export default routes
