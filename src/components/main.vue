<template>
  <div>
    <div id="main">
      <h1 class="nombreempresa">BioTherapia</h1>
    </div>

    <v-carousel cycle :interval="2500" show-arrows="hover" height="600" cover hide-delimiter-background class="carrusel">
      <v-carousel-item src="../assets/acupuntura.jpg" cover></v-carousel-item>
      <v-carousel-item src="../assets/aromaterapia.jpg" cover></v-carousel-item>
      <v-carousel-item src="../assets/aromaterapia2.jpg" cover></v-carousel-item>
      <v-carousel-item src="../assets/maderoterapia.jpg" cover></v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import db from '@/firebase/init'
import { collection, getDocs, query } from 'firebase/firestore'
export default {
  name: 'MainComponent',
  data() {
    return {
      showPopup: false,
      username: '',
      password: '',
      users:[],
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
        console.log(this.users)
      },
    async verificacion(){
      const vUser = this.users.find((user)=> user.usuario === this.username && user.pass === this.password);
      if (vUser){
        console.log("Entrando")
        this.$router.push({path:'/home'})
      }
    },
    async logIn(){
      await this.listarUsuarios();
      this.verificacion()
    }
  }
};
</script>

<style scoped>
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
  background-color: #C8E6C9;
}
#main {
  text-align: center;
  margin-top: 20px;
}

.nombreempresa {
  color: #33691E;
  font-size: 2rem;
  /* Cambia el tamaño del texto del nombre de la empresa */
}

.carrusel {
  margin-top: 20px;
}

.loginbutton {
  display: block;
  /* Para centrar horizontalmente el botón */
  margin: 0 auto;
  /* Para centrar horizontalmente el botón */
  background-color: #43A047;
  /* Cambia el color del botón */
  color: white;
  padding: 10px 20px;
  margin: 10px auto;
  font-size: 1.2rem;
  width: 100%;
  /* Cambia el tamaño del texto del botón */
  cursor: pointer;
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