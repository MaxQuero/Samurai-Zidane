import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Home from "./components/Home";
import Battlefield from "./components/Battlefield";
//import Login from "./components/Login"
import Register from "./components/Register";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {path: '/', component: Battlefield, name: 'battlefield', params: { user: 'test' }},
    {path: '/register', component: Register, name: 'register'},
    { path: '/home', component:  Home, name: 'home'},
    { path: '/battlefield', component: Battlefield, name: 'battlefield' }
  ]
});

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
