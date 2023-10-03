import { createRouter, createWebHistory } from 'vue-router'
import main from '..//components/main.vue'
import ventas from '..//components/ventas_com.vue'
import usuarios from '..//components/usuarios_com.vue'
import crearusuarios from '..//components/crear_usuarios.vue'
import Login from '../components/Login.vue'

const routes = [
    {path: "/", name: "main", component: main,},
    {path: "/Login", name: "Login_com", component: Login,},
    {path: "/ventas", name: "Ventas", component: ventas,},
    {path: "/usuarios", name: "usuarios", component: usuarios,},
    {path: "/crearusuarios", name: "crearusuarios", component: crearusuarios,},

]
const router = createRouter({
    history: createWebHistory(),routes,
})
export default router



