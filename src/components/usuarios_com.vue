
<template>
  <v-data-table 
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'producto', order: 'asc' }]"
    style="max-height: 100%;"
  >
    <template v-slot:top>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              dark
              v-bind="props"
              class="btnuser"
            >
              Nuevo Usuario
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.ndocumento"
                      label="N° Documento"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.nombre"
                      label="Nombre"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.telefono"
                      label="Telefono"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.correo"
                      label="Correo"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="close"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="save"
              >
                Agregar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="msgdelete">¿Esta seguro/a de eliminar este item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">Si</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon
        size="small"
        class="me-2"
        @click="editItem(item.raw)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        size="small"
        @click="deleteItem(item.raw)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-progress-linear
      indeterminate
      color="#3B3236"
    ></v-progress-linear>
    </template>
  </v-data-table>
</template>
<script >
import db from '@/firebase/init'
import { addDoc, collection, getDocs, query , updateDoc , doc, deleteDoc } from 'firebase/firestore'

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'N° Documento',
          align: 'start',
          sortable: false,
          key: 'ndocumento',
        },
        { title: 'Nombre', key: 'nombre' },
        { title: 'Telefono', key: 'telefono' },
        { title: 'Correo', key: 'correo' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        keyid: 0,
        ndocumento: 0,
        nombre: '',
        telefono: 0,
        correo: '',
      },
      defaultItem: {
        ndocumento: 0,
        nombre: '',
        telefono: 0,
        correo: '',
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Nuevo Usuario' : 'Editar Usuario'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.listarUsuarios()
    },

    methods: {
      async listarUsuarios(){
        const q = query(collection(db,'usuarios'));
        const result = await getDocs(q);
        result.forEach((doc)=>{
          this.desserts.push({
            keyid:doc.id,
            ndocumento:doc.data().ndocumento,
            nombre:doc.data().nombre,
            telefono:doc.data().telefono,
            correo:doc.data().correo
          })
        })
      },
      async crearUsuario(){
        const colRef = collection(db,'usuarios');
        const dataObj = {
          ndocumento: this.editedItem.ndocumento,
          nombre: this.editedItem.nombre,
          telefono: this.editedItem.telefono,
          correo: this.editedItem.correo,
        }
        const docRef = await addDoc(colRef,dataObj)
        console.log(docRef.id)
      },
      
      async updateUsuarios(){
        const ref = doc(db,'usuarios',this.editedItem.keyid)
        await updateDoc(ref,{
          nombre:this.editedItem.nombre,
          telefono:this.editedItem.telefono,
          correo:this.editedItem.correo,
        })
      },

      async deleteUsuarios(){
        await deleteDoc(doc(db,'usuarios',this.editedItem.keyid))
      },

      editItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
        this.deleteUsuarios()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
          this.updateUsuarios()
        } else {
          this.desserts.push(this.editedItem)
          this.crearUsuario()
        }
        this.close()
      },
    },
  }
</script> 
<style scoped>
.elevation-1{
  background-color: rgba(172, 255, 47, 0.189);

}
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
.msgdelete{
  text-align: center;
}
.btnuser{
  width: 20%;
  margin-left: 1%;
  margin-bottom: 1%;
  margin-top: -0.5%;
  background-color: #6B3236;
  color: white;
}
</style>
