import Vue from 'vue'
import VueRouter from 'vue-router'
import {taskRoutes} from "@/router/taskRoutes";

Vue.use(VueRouter)

const router = new VueRouter({
    base: process.env.BASE_URL,
    mode: 'history',
    scrollBehavior() {
        return { x: 0, y: 0 }
    },
    routes:[
        {
            path: '/',
            redirect: "/tasks"
        },
        ...taskRoutes,
        {
            path: '/404',
            name: '404',
            meta: {
                title: 'Error 404',
            },
            component: () => import('@/views/404'),
        },
        {
            path: '/*',
            redirect: '404',
            hidden: true,
        },

    ],
});

// router.beforeEach((to, from, next) => {
//     if (to.matched.some(record => record.meta.authRequired)) {
//         // этот путь требует авторизации, проверяем залогинен ли
//         // пользователь, и если нет, перенаправляем на страницу логина
//         if (!auth.loggedIn()) {
//             next({
//                 path: '/login',
//                 query: { redirect: to.fullPath }
//             })
//         } else {
//             next()
//         }
//     } else {
//         next() // всегда так или иначе нужно вызвать next()!
//     }
// })

export default  router;