<template>
  <div :id="main">
      <h1 class="nombreempresa">BioTherapia</h1>
    </div>
  
    <v-carousel cycle :interval="2500" show-arrows="hover"
    height="600"
    cover
    hide-delimiter-background class="carrusel">
    
    <v-carousel-item
      src="../assets/acupuntura.jpg"
      cover
    ></v-carousel-item>
  
    <v-carousel-item
    src="../assets/aromaterapia.jpg"
      cover
    ></v-carousel-item>
  
    <v-carousel-item
    src="../assets/aromaterapia2.jpg"
      cover
    ></v-carousel-item>
    <v-carousel-item
      src="../assets/maderoterapia.jpg"
      cover
    ></v-carousel-item>
  </v-carousel>
  
  </template>
  
  <script>
  export default {
    name:'main_comp'}
  
    </script>
  <style scoped>
  h1{
    text-align: center;
    font-size: 800%; 
  }
  .nombreempresa{
    color: #33691E
  ;
  }
  .carrusel{
    margin-top: 20px;
    padding-left: 20px;
    padding-right: 20px;
  }
  .v-carousel__controls{
    width: 1030px;
  }
  p{
  margin-left: 20px;
  margin-right: 20px;
  
  }
  </style>