<template>
  <v-app>
  <v-toolbar color="#79464a">

    <v-img :max-width="70" id="logonav" src="../src/assets/logoN.png"></v-img>
    <v-toolbar-title>BIOTHERAPIA</v-toolbar-title>

  </v-toolbar>
  <v-card>
    <v-layout>
      <v-navigation-drawer color="#f0eaea" permanent location="left">
        <v-divider></v-divider>
        <v-list density="compact" nav>
          <router-link class="rlnav" to="/"><v-list-item style="color: black;" prepend-icon="mdi mdi-home" title="INICIO"
              value="myfiles"></v-list-item></router-link>
              <div class="divshow" v-if="logged">
                <router-link class="rlnav" to="/ventas"><v-list-item style="color: black;" prepend-icon="mdi mdi-folder-heart" title="PRODUCTOS"
              value="shared"></v-list-item></router-link>
              <router-link class="rlnav" to="/servicios"><v-list-item style="color: black;" prepend-icon="mdi mdi-head-heart" title="SERVICIOS"
              value="shared"></v-list-item></router-link>
              <router-link class="rlnav" to="/pacientes"><v-list-item style="color: black;" prepend-icon="mdi-account-multiple" title="PACIENTES"
              value="shared"></v-list-item></router-link>
              <router-link class="rlnav" to="/informes"><v-list-item style="color: black;" prepend-icon="mdi mdi-file-document-multiple" title="INFORMES"
              value="shared"></v-list-item></router-link>
            </div>
        </v-list>
        <template v-slot:append>
             <div class="pa-2">
            <v-btn class="logb"
            @click="logged ? vlogOut=true : logIn()"
            block>
            {{ logged ? 'Log Out' : 'Log In' }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
      <v-main class="main">
        <router-view></router-view>
      </v-main>
    </v-layout>
  </v-card>
  <v-dialog
  v-model="showPopup">
    <v-card class="cardLogIn">
            <div class="loginLogo">
        <v-img src="../src/assets/logoBiotherapia.png" height="200px"></v-img>
      </div>
      <br />
      <input type="text" v-model="username" placeholder="Ingrese su Usuario" />
      <input type="password" v-model="password" placeholder="Ingrese su Contraseña" />
      <v-btn @click="verificacion()" class="btnLogIn">Iniciar Sesion</v-btn>
    </v-card>
  </v-dialog>
  <v-dialog
  v-model="vlogOut">
  <v-card class="txtlogout" title="¿Desea cerrar sesion?">
    <v-card-actions>
        <v-btn @click="vlogOut=false">No</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="logOut()">Si</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</v-app>
</template>
<script>
import db from '@/firebase/init'
import { collection, getDocs, query } from 'firebase/firestore'
export default {
    name: 'App',
    data() {
    return {
      showPopup: false,
      username: '',
      password: '',
      users:[],
      logged:false,
      vlogOut:false,
    };
  },
  methods: {
    async listarUsuarios(){
        const q = query(collection(db,'usuarios'));
        const result = await getDocs(q);
        result.forEach((doc)=>{
          this.users.push({
            usuario:doc.data().user,
            pass:doc.data().password,
          })
        })
      },
    async verificacion(){
      const vUser = this.users.find((user)=> user.usuario === this.username && user.pass === this.password);
      if (vUser){
        this.logged = true
        this.$router.push({path:'/'})
        this.showPopup = false
      }
    },
    async logIn(){
      this.showPopup = true
      await this.listarUsuarios();
    },
    async logOut() {
    this.vlogOut = false
    this.logged = false;
    this.$router.push({ path: '/' });
  }
  }
}
</script >
<style scoped>
.txtlogout{
  width: 20%;
  margin: 0 auto;
  text-align: center;
}
.main{
  height: 93vh;
}
#logonav{
  margin-left: 1%;
}
.rlnav{
  text-decoration: none;
}
.btnLogIn{
  margin: 0 auto;
  margin-bottom: 4%;
  margin-top: 2%;
  border-radius: 20px 10px;
  background-color: brown;
  color: white;
}
.cardLogIn{
  width: 20%;
  margin: 0 auto;
  background-color: #f0eaea;
}
#main {
  text-align: center;
  margin-top: 20px;
}
.loginLogo {
  text-align: center;
  margin-top: 5%;
}
input{
  border-style:double;
  border-color: black;
  border-radius: 10px 20px;
  width: 80%;
  margin: 0 auto  ;
  margin-bottom: 2%;
  padding: 1%;
  padding-left: 7%;
  font-size: 120%;
}

</style>
