import Vue from 'vue';
import Router from 'vue-router';
import Error404 from './views/Error404.vue';
import Home from './views/Home.vue';
import HomeMain from './components/home/Main.vue';
import HomeStats from './components/home/Stats.vue';

Vue.use(Router)

export default new Router({
  mode : 'history',
  routes : [
    {
      path : '*',
      component : Error404
    },
    {
      path : '/',
      component: Home,
      children : [
        {
          path : '',
          component : HomeMain
        },
        {
          path : ':id/stats',
          component : HomeStats
        }
      ]
    }
  ]
})