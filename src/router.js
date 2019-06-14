// eslint-disable-next-line vue/no-parsing-error
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store';

Vue.use(Router)

const router =  new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        isAuth: true,
      }
    },
    {
      path: '/sign',
      name: 'sign',
      component: () => import('./views/Accounts/Sign.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/Accounts/Profile.vue'),
      meta: {
        isAuth: true,
      }
    },
    {
      path: '/corps',
      name: 'corps',
      component: () => import('./views/Corps/Lists.vue'),
      meta: {
        isAuth: true,
      }
    },
    {
      path: '/usermanage',
      name: 'usermanage',
      component: () => import('./views/Users/Manage.vue'),
      meta: {
        isAuth: true,
      }
    },
    {
      path: '/paperlists',
      name: 'paperlists',
      component: () => import('./views/Papers/Lists.vue'),
      meta: {
        isAuth: true,
      }
    },
    {
      path: '/paperedit',
      name: 'paperedit',
      component: () => import('./views/Papers/Edit.vue'),
      meta: {
        isAuth: true,
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.isAuth)) {
    let expire = Number(localStorage.getItem('expire')) ||0;
    let isSignin = false;
    let user = localStorage.getItem('user');
    if( user && expire > Date.now()) {
      isSignin = true;
    }

    if (!isSignin) {
      store.commit('setSignin', false);
      store.commit('setUser', null);
      next({
        path: '/sign',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router;
