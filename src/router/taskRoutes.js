export const taskRoutes = [
  {
    path: '/tasks',
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
        path: '/tasks/add',
        meta: {
          title: 'add Task',
        },
        name: 'TaskCreate',
        component: () => import('@/views/tasks/store'),
      },
    ],
  },
]