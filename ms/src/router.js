// import { nextTick } from 'q';
export default {
    mode: 'history',
    routes: [
        {
            path: '/login',
            name: "login",
            component: () => import('./vue/login')
        }, {
            path: '/manager',
            meta: { needAuth: true },
            name: "layout",
            

            component: () => import('./vue/layout'),
            children: [
                {
                    path: 'user',// /manager/user
                    name: "user",
                    component: () => import('./vue/user')
                }, {
                    path: 'order',// /manager/order
                    name: "order",
                    component: () => import('./vue/order')
                },{
                    path: 'category',// /manager/order
                    name: "category",
                    component: () => import('./vue/category')
                },
                {
                    path: 'ads',// /manager/order
                    name: "ads",
                    component: () => import('./vue/ads')
                },
                {
                    path: 'ticket',// /manager/order
                    name: "ticket",
                    component: () => import('./vue/ticket')
                },
                {
                    path: 'admin',// /manager/order
                    name: "admin",
                    component: () => import('./vue/admin')
                },
                {
                    path: 'admin2',// /manager/order
                    name: "admin2",
                    component: () => import('./vue/admin2')
                },
                {
                    path: 'order',// /manager/order
                    name: "order",
                    component: () => import('./vue/order')
                }
            ]
        },
        {
            path:'*',
            redirect: '/login'
        }
    ]
}