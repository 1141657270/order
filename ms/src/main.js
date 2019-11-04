import Vue from 'vue';
import VueRouter from 'vue-router';
import routerConfig from './router';
import App from './vue/App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import  axios from  'axios';
Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.use(VueRouter);

var router = new VueRouter(routerConfig);
router.beforeEach((to, from, next) => {
    if(to.matched.filter(function(item){ return  item.meta.needAuth==true}).length==0){
        next();
    }else{
        var arr, reg = new RegExp("(^| )" + 'node_auth' + "=([^;]*)(;|$)");
        arr = document.cookie.match(reg)
        if (arr ? unescape(arr[2]) : null) { 
            next(); 
        } else {
            next({ path: '/login', query: { returnUrl: to.fullPath } });//拦截
        }
    }
})
new Vue({
    el: "#app",
    //  template:'<h></h>',
    render: (h) => h(App),
    router: router
})



