<template>
  <v-card
    class="mx-auto"
    max-width=""
  >
    <v-layout>
      <v-app-bar
        color="rgba(172, 255, 47, 0.189)"
        density="compact"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>INVENTARIO</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row dense>
            <v-col
              v-for="n in 8"
              :key="n"
              cols="3"
            >
              <v-sheet
                color="rgba(172, 255, 47, 0.189)"
                height="300"
              ></v-sheet>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
    <!-- <div class="ventas">
      <h1>Ventas</h1>


    </div> -->
    
  </template>

  
  <script>
  export default {
    name: 'ventas_com',
    props: {
      nombre1: String
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  </style>