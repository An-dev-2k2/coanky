import Default from '@/views/Layouts/Default.vue'
import Admin from '@/views/Layouts/Admin.vue'

const routes = [
  {
    path: '/',
    meta: {
      authRequired: false,
      title: 'Trang chủ',
      hideHeader: true,
    },
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
  {
    path: '/tours',
    component: Default,
    children: [
      {
        path: '',
        name: 'tours',
        meta: {
          title: 'Danh sách tour',
          authRequired: false,
          hideHeader: false,
        },
        component: () => import('@/views/Clients/Tours.vue'),
      },
      {
        path: ':slug',
        name: 'tour-detail',
        meta: {
          title: 'Chi tiết tour',
          authRequired: true,
        },
        component: () => import('@/views/Clients/TourDetail.vue'),
      },
    ],
  },
  {
    path: '/icons',
    component: Default,
    children: [
      {
        path: '',
        name: 'icons',
        meta: {
          title: 'Sổ tay ấn ký',
          authRequired: false,
          hideHeader: false,
        },
        component: () => import('@/views/Clients/Icons.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: Default,
    children: [
      {
        path: '',
        name: 'login',
        meta: {
          title: 'Đăng nhập',
          authRequired: false,
          hideHeader: false,
        },
        component: () => import('@/views/Clients/Login.vue'),
      },
    ],
  },
  {
    path: '/register',
    component: Default,
    children: [
      {
        path: '',
        name: 'register',
        meta: {
          title: 'Đăng ký',
          authRequired: false,
          hideHeader: false,
        },
        component: () => import('@/views/Clients/Register.vue'),
      },
    ],
  },
  //admim
  {
    path: '/admin/login',
    name: 'login-admin',
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
          authRequired: true,
        },
        component: () => import('@/views/Admin/Dashboard.vue'),
      },
      {
        path: 'tours',
        name: 'tours-admin',
        meta: {
          title: 'Danh sách tour',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Tours.vue'),
      },
      {
        path: 'tours/create',
        name: 'tours-create',
        meta: {
          title: 'Thêm tour',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Tours/Create.vue'),
      },
      {
        path: 'tours/:id/edit',
        name: 'tours-edit',
        meta: {
          title: 'Cập nhật tour',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Tours/Create.vue'),
      },
      {
        path: 'icons',
        name: 'icons-admin',
        meta: {
          title: 'Danh sách Ấn Ký',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Icons.vue'),
      },
      {
        path: 'audios',
        name: 'audios',
        meta: {
          title: 'Danh sách Audio',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Audios.vue'),
      },
      {
        path: 'orders',
        name: 'orders',
        meta: {
          title: 'Danh sách đơn hàng',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Orders.vue'),
      },
      {
        path: 'users',
        name: 'users',
        meta: {
          title: 'Danh sách người dùng',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Users.vue'),
      },
      {
        path: 'transactions',
        name: 'transactions',
        meta: {
          title: 'Lịch sử giao dịch',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Transactions.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        meta: {
          title: 'Cài đặt',
          authRequired: true,
        },
        component: () => import('@/views/Admin/Settings.vue'),
      },
    ],
  },
]

export default routes
