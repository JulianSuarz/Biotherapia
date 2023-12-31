import { createRouter, createWebHistory } from 'vue-router'
import main from '..//components/main.vue'
import ventas from '..//components/ventas_com.vue'
import pacientes from '..//components/usuarios_com.vue'
import Login from '../components/Login.vue'
import servicios from '../components/servicios_com.vue'
import informes from '../components/informes_com.vue'

const routes = [
    {path: "/", name: "main", component: main,},
    {path: "/Login", name: "Login_com", component: Login,},
    {path: "/ventas", name: "Ventas", component: ventas,},
    {path: "/pacientes", name: "pacientes", component: pacientes,},
    {path:"/servicios",name:'servicios',component:servicios},
    {path:"/informes",name:'informes',component:informes}
]
const router = createRouter({
    history: createWebHistory(),routes,
})
export default router



