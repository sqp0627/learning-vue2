import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import goods from '@/components/goods/goods'
import seller from '@/components/seller/seller'
// import ratings from '@/components/ratings/ratings.vue' // webpack配置的引用路径，详见webpack.base.conf.js
import ratings from '../components/ratings/ratings.vue' // 这种写法和上面这种写法都可以
Vue.use(Router)
Vue.use(VueResource)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    { path: '/goods', name: 'goods', component: goods }, // name也可以是中文
    { path: '/ratings', name: 'ratings', component: ratings },
    { path: '/seller', name: 'seller', component: seller },
    {path: '/', redirect: '/goods'}// 根目录重定向
  ]
})
