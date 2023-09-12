<template>
    <v-container>
        <h1>Crear usuarios</h1>
    </v-container>
</template>
<script>
 import db from '../firebase/init.js'
 import {collection, addDoc} from 'firebase/firestore'

export default{
    
    create(){
        this.createUsuario()

    },
        methods:{
            async createUsuario(){
                const colRef= collection(db, 'user')
                const doc={
                    id:'2',
                    nombre:"Jesus",
                    password: "1234"
                }
                const docRef = await addDoc(colRef, doc)
                console.log('creo el usuario con nombre', docRef.id)

            }
        }
 }
</script>