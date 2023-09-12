<template>
    <v-toolbar
   color="#43A047">
  
    <v-img 
    :max-width="50"
    src="./assets/logo.png"></v-img>
    <v-toolbar-title>BioTherapia</v-toolbar-title>
  
  </v-toolbar>
    <v-card>
      <v-layout>
        <v-navigation-drawer color="#A5D6A7" class="mainmenu"
          permanent
          location="left"
        >
          <v-divider ></v-divider>
          <v-list density="compact" nav>
            <router-link to="/"><v-list-item  prepend-icon="mdi-folder" title="INICIO" value="myfiles"></v-list-item></router-link>
            <router-link to="/ventas"><v-list-item  prepend-icon="mdi-account-multiple" title="INVENTARIO" value="shared"></v-list-item></router-link>
            <router-link to="/usuarios"><v-list-item  prepend-icon="mdi-account-multiple" title="USUARIOS" value="shared"></v-list-item></router-link>
            <router-link to="/crearusuarios"><v-list-item  prepend-icon="mdi-account-multiple" title="CREAR USUARIOS" value="shared"></v-list-item></router-link>
            <router-link to="/Login"><v-list-item  prepend-icon="mdi-account-multiple" title="SIGN IN/SIGN UP" value="shared"></v-list-item></router-link>  
          </v-list>
        </v-navigation-drawer >
        <v-main class="main">
          <router-view></router-view>
        </v-main> 
      </v-layout>
    </v-card>
    <v-footer></v-footer>
  
  </template>
  
  <style>
  
  .logo{
    margin-left: 2%;
  }
  .mainmenu{
  margin-top: 64px;
  }
  .main{
    background-color: #C8E6C9;
  }
  
  </style>
  <script>
  
  export default {
    name: 'App',
  
    data: () => ({
      //
    }),
  }
  </script>
  