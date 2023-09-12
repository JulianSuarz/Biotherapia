
<template>
  <v-data-table 
    :headers="headers"
    :items="desserts"
    :sort-by="[{ key: 'producto', order: 'asc' }]"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar color="green"
        flat
      >
        <v-toolbar-title>INVENTARIO</v-toolbar-title>
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
              color="blue"
              dark
              class="mb-2"
              v-bind="props"
            >
              Nuevo Producto
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">Nuevo Producto</span>
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
                      v-model="editedItem.producto"
                      label="Producto"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.stock"
                      label="Stock"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.precio"
                      label="Precio"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-textarea 
                    v-model="editedItem.descripcion"
                    label="Descripcion"></v-textarea>
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
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
>
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
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
<script >
import db from '@/firebase/init'
import { addDoc, collection, getDocs, query } from 'firebase/firestore'

  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          title: 'Producto',
          align: 'start',
          sortable: false,
          key: 'producto',
        },
        { title: 'Descripcion', key: 'descripcion' },
        { title: 'Stock', key: 'stock' },
        { title: 'Precio', key: 'precio' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
      desserts: [],
      editedIndex: -1,
      editedItem: {
        producto: '',
        descripcion: '',
        stock: 0,
        precio: 0,
      },
      defaultItem: {
        producto: '',
        descripcion: '',
        stock: 0,
        precio: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
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
      this.listarProductos()
    },

    methods: {
      async listarProductos(){
        const q = query(collection(db,'producto'));
        const result = await getDocs(q);
        result.forEach((doc)=>{
          this.desserts.push(doc.data())
        })
      },
      async crearProducto(){
        const colRef = collection(db,'producto');
        const dataObj = {
          producto: this.editItem.producto,
          descripcion: this.editItem.descripcion,
          stock: this.editItem.stock,
          precio: this.editItem.precio,
        }
        const docRef = await addDoc(colRef,dataObj)
        console.log(docRef.id)
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
        } else {
          this.desserts.push(this.editedItem)
          this.crearProducto()
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
</style>
