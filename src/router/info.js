const routes = {
  path: '/info',
  component: () => import('../views/info/blank.vue'),
  children: [
    {
      path: '',
      component: () => import('../views/info')
    },
    {
      path: '/infoDetail/:id',
      component: () => import('../views/info/info-detail.vue')
    }
  ]
}

export default routes
