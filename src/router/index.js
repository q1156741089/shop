import Vue from 'vue'
import VueRouter from 'vue-router'

const login  = ()=>import('views/login/login')
const home   = ()=>import('views/home/home')
const welcome =()=>import('views/home/children/welcome')
const users =()=>import('views/user/user')
const rights =()=>import('views/power/PowerList')
const roles =()=>import('views/power/PowerRoles')
const goodscate=()=>import('views/cate/GoodsCate')
const paramscate=()=>import('views/cate/ParamsCate')
const goods =()=>import('views/cate/goods')
const goodsAdd=()=>import('views/cate/goodsAdd')
const orders =()=>import('views/orders/orders')
const reports =()=>import('views/reports/reports')
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

  const routes = [
  {
      path: '/login',
      component: login
    },
      {
          path: '',
          redirect : '/login'
      },
      {
          path : '/home',
          component : home,
          children :[{path : '/welcome',component : welcome},
              {path: '',  redirect : '/welcome'},
              {path: '/users',component : users },
              {path: '/rights',component : rights },
              {path: '/roles',component : roles },
              {path: '/categories',component : goodscate },
              {path: '/params',component : paramscate },
              {path: '/goods',component : goods },
              {path: '/goods/add',component : goodsAdd },
              {path: '/orders',component : orders },
              {path: '/reports',component : reports }
          ]
      }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
   //to去哪里
    //from来自哪里
    //next 放行
    if (to.path !== '/login' && !window.sessionStorage.getItem('token')) next({ path: '/login' })
    // 如果用户未能验证身份，则 `next` 会被调用两次
    next()
})


export default router
