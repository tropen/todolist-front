export const taskRoutes = [
  {
    path: '/tasks',
    // meta: { authRequired: true, hidden: true },
    component: () => import('@/layouts/App'),
    children: [
      {
        path: '/tasks',
        meta: {
          title: 'Tasks',
        },
        name: 'tasks',
        component: () => import('@/views/tasks'),
      },
      // {
      //   path: 'tasks/:id',
      //   meta: {
      //     title: 'Edit Task',
      //   },
      //   name: 'TaskEdit',
      //   component: () => import('@/views/tasks/store'),
      // },
      {
        path: 'create',
        meta: {
          title: 'Create Task',
        },
        name: 'TaskCreate',
        component: () => import('@/views/tasks/store'),
      },
      // {
      //   path: 'delete/:id',
      //   meta: {
      //     title: 'Delete Task',
      //   },
      //   name: 'TaskDelete',
      //   component: () => import('@/views/tasks/delete'),
      // },
    ],
  },
]