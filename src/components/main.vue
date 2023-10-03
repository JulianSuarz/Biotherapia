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
  <!-- <v-btn block 
  :loading="active">
  hola
  </v-btn> -->
  <button class="loginbutton" @click="showLoginPopup">Login</button>

  <div v-if="showPopup" class="login-popup">
    <!-- Formulario de inicio de sesión -->
    <h2>Iniciar sesión</h2>
    <form>
      <div class="loginLogo">
        <v-img src="../assets/logoBiotherapia.png" height="200px"></v-img>
      </div>
      <br />
      <input type="text" id="username" v-model="username" placeholder="Ingrese su Usuario" />
      <input type="password" id="password" v-model="password" placeholder="Ingrese su Contraseña" />
      <div class="buttonsContainer">
        <button class='loginButton' @click="login">Iniciar sesión</button>
        <button class="cancelLogin" @click="cancelLogin">Cancelar</button>

      </div>
    </form>
  </div>
</template>

<script>
// import firebase from 'firebase'; // Asegúrate de importar Firebase correctamente
export default {
  name: 'MainComponent',
  data() {
    return {
      showPopup: false,
      username: '',
      password: ''
    };
  },
  methods: {
    showLoginPopup() {
      this.showPopup = true;
    },
    // login() {
    //   // Lógica de autenticación utilizando Firebase
    //   firebase
    //     .auth(),
    //     .signInWithEmailAndPassword(this.username, this.password)
    //     .then(userCredential => {
    //       // Autenticación exitosa
    //       console.log('Usuario autenticado:', userCredential.user);
    //       // Una vez autenticado, puedes cerrar el formulario emergente
    //       this.showPopup = false;
    //     })
    //     .catch(error => {
    //       // Manejo de errores de autenticación
    //       console.error('Error de autenticación:', error);
    //       // Puedes mostrar un mensaje de error al usuario si lo deseas
    //     });
    // },
    cancelLogin() {
      this.showPopup = false;
    }
  }
};
</script>

<style scoped>
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

.login-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.login-popup h2 {
  color: white;
}

.login-popup form {
  background-color: #C8E6C9;
  padding: 20px;
  border-radius: 5px;
}

div.loginLogo {
  text-align: center;
}

input#username{
  border-style:double;
  border-color: black;
  border-radius: 10px 20px;

}
input#password{
  border-style:double;
  border-color: black;
  border-radius: 10px 20px;

}
div.buttonsContainer {
  text-align: right;
}

.login-popup input {
  border: 2px;
  border-color: black;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.login-popup button.loginButton {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

.login-popup button.cancelLogin {
  background-color: #e73434;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin: 5px;
}
</style>