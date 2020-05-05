const routes = {
  path: '/info',
  component: () => import('../views/info/blank.vue'),
  children: [
    {
      path: '',
      component: () => import('../views/info')
    }
  ]
}

export default routes
