<template>
  <div>
    <div id="main">
      <h1 class="nombreempresa">BIOTHERAPIA</h1>
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
.nombreempresa{
  color: brown;
  text-align: center;
  font-size: 100px;
}
</style>