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
            path: '/500',
            name: '500',
            meta: {
                title: 'Error 500',
            },
            component: () => import('@/views/500'),
        },
        {
            path: '/*',
            redirect: '404',
            hidden: true,
        },

    ],
});

export default  router;