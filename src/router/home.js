const routes = {
  path: '/home',
  component: () => import('../views/home/blank.vue'),
  children: [
    {
      path: '',
      component: () => import('../views/home')
    },
    {
      path: 'rent',
      component: () => import('../views/home/rent.vue')
    },
    {
      path: 'houseDetail/:id',
      component: () => import('../views/home/house-detail.vue')
    },
    {
      path: 'maphouse',
      component: () => import('../views/home/map-house.vue')
    },
    {
      path: 'navmaphouse',
      component: () => import('../views/home/navmap-house.vue')
    },
    {
      path: 'navmaphousebus',
      component: () => import('../views/home/navmapbus-house.vue')
    }
  ]
}

export default routes
