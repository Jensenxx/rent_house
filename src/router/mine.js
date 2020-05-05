const routes = {
  path: '/mine',
  component: () => import('../views/mine/blank.vue'),
  children: [
    {
      path: '',
      component: () => import('../views/mine')
    },
    {
      path: 'edit',
      component: () => import('../views/mine/edit.vue')
    },
    {
      path: 'publish',
      component: () => import('../views/mine/publish.vue')
    },
    {
      path: 'contract',
      component: () => import('../views/mine/contract.vue')
    },
    {
      path: 'appointment',
      component: () => import('../views/mine/appointment.vue')
    },
    {
      path: 'minehouse',
      component: () => import('../views/mine/mine-house.vue')
    },
    {
      path: 'publishhouse',
      component: () => import('../views/mine/publish-house.vue')
    },
    {
      path: 'contractRequest',
      component: () => import('../views/mine/contract-request.vue')
    }
  ]
}

export default routes
