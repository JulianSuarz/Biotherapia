<template>
<div :id="main">
    <h1>BioTherapia</h1>
  </div>
  <v-carousel class="carrusel"
    cycle
    height="400"
    hide-delimiter-background
    show-arrows="hover"
  >
    <v-carousel-item
      v-for="(slide, i) in slides"
      :key="i"
    >
      <v-sheet
        :color="colors[i]"
        height="100%"
      >
        <div class="d-flex fill-height justify-center align-center">
          <div class="text-h2">
            {{ slide }} Slide
          </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
export default {
  name:'main_comp',
    data () {
      return {
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
          'deep-purple accent-4',
        ],
        slides: [
          'First',
          'Second',
          'Third',
          'Fourth',
          'Fifth',
        ],
      }
    }
}
  </script>
<style scoped>
h1{
  text-align: center;
  font-size: 800%; 
}
.carrusel{
  padding-left: 15px;
  padding-right: 15px;
}

</style>