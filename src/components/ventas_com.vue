<template>
  <v-data-table 
    :headers="headers"
    :items="desserts"
    class="elevation-1"
    height="calc(80vh)"
    show-footer="false"
    
  >
    <template v-slot:top>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
      <v-dialog
        v-model="dialogv"
        persistent
        
      >
        <template v-slot:activator="{ props }">
          <v-btn
            class="btnventa"
            color="primary"
            v-bind="props"
          >
            Venta
          </v-btn>
        </template>
        <v-card class="cardventa">
          <v-card-title class="text-h5">
            Venta
          </v-card-title>
          <v-card-text>
            <v-table class="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(producto, index) in productosVenta" :key="index">
                    <td>{{ producto.producto }}</td>
                    <td>
                  <input
                    type="number"
                    v-model="producto.cantidad"
                    @input="subtotalVenta(producto)"
                  />
                </td>
                    <td>{{ producto.precio }}</td>
                    <td>{{ parseInt(producto.cantidad) * parseInt(producto.precio)}}</td>
                  </tr>
              </tbody>
              <v-alert
              v-if="faltaStock"
              type="error"
              outline>
                Stock Insuficiente
              </v-alert>
          </v-table>
          </v-card-text>
          <v-card-actions >
            <v-spacer></v-spacer>
            <v-btn 
              color="green-darken-1"
              variant="text"
              @click="dialogv = false"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="green-darken-1"
              variant="text"
              @click="confirmVenta()"

            >
              Realizar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
        <template v-slot:activator="{ props }">
            <v-btn
              dark
              class="nproducto"
              v-bind="props"
            >
              Nuevo Producto
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
        class="me-2"
        @click="deleteItem(item.raw)"
      >
        mdi-delete
      </v-icon>
      <v-icon
        size="small"
        @click="addToCompras(item.raw)"
      >
        mdi mdi-plus-thick
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
import { addDoc, collection, getDocs, query , updateDoc , doc, deleteDoc } from 'firebase/firestore'
import jsPDF from 'jspdf';
require('jspdf-autotable')

  export default {
    data: () => ({
        dialogv:false,
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
            { title: '', key: 'actions', sortable: false },
        ],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            keyid: 0,
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
        compras: [],
        headersCompras: [
            { title: 'Producto', key: 'producto' },
            { title: 'Cantidad', key: 'cantidad' },
            { title: 'Precio', key: 'precio' },
            { title: '', key: 'actions', sortable: false }
        ],
        counters: {},
        productosVenta:[]
    }),
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto';
        },
        items() {
            return Array.from({ length: this.stock }, (v, i) => i + 1);
        },
    },
    watch: {
        dialog(val) {
            val || this.close();
        },
        dialogDelete(val) {
            val || this.closeDelete();
        },
    },
    created() {
        this.listarProductos();
    },
    methods: {
        async listarProductos() {
            const q = query(collection(db, 'producto'));
            const result = await getDocs(q);
            result.forEach((doc) => {
                this.desserts.push({
                    keyid: doc.id,
                    producto: doc.data().producto,
                    descripcion: doc.data().descripcion,
                    stock: doc.data().stock,
                    precio: doc.data().precio,
                });
            });
        },
        async crearProducto() {
            const colRef = collection(db, 'producto');
            const dataObj = {
                producto: this.editedItem.producto,
                descripcion: this.editedItem.descripcion,
                stock: this.editedItem.stock,
                precio: this.editedItem.precio,
            };
            const docRef = await addDoc(colRef, dataObj);
            console.log(docRef.id);
            this.clear();
            this.listarProductos();
        },
        async updateProductos() {
            const ref = doc(db, 'producto', this.editedItem.keyid);
            await updateDoc(ref, {
                producto: this.editedItem.producto,
                descripcion: this.editedItem.descripcion,
                stock: this.editedItem.stock,
                precio: this.editedItem.precio,
            });
        },
        async deleteProductos() {
            await deleteDoc(doc(db, 'producto', this.editedItem.keyid));
        },
        addToCompras(item) {  
          let nuevaVenta = {
              keyid:item.keyid,
              producto:item.producto,
              cantidad:1,
              precio:item.precio,
            }
            this.productosVenta.push(nuevaVenta)
        },
        async confirmVenta(){
          this.productosVenta.forEach((producto)=>{
            const productoLista = this.desserts.find(item => item.keyid=== producto.keyid)
            if (productoLista){
              const cantidadVendida = parseInt(producto.cantidad)
              if (cantidadVendida > productoLista.stock){
                this.faltaStock = true
                return;
              } else {
                const stockAct = productoLista.stock -= cantidadVendida
                const ref = doc(db,'producto',producto.keyid)
                const updateData = {
                  stock: producto.stock = stockAct
                }
                updateDoc(ref,updateData)
                this.generatePDF()
                this.close()
              }
            }
            
          })
        },
        subtotalVenta(producto) {
        producto.subtotal = parseInt(producto.cantidad) * parseInt(producto.precio);
      },
        removeFromCompras(item) {
            this.compras = this.compras.filter(compra => compra.producto !== item.producto);
        },

        async generatePDF() {
          let columns = [
            { title: "Producto", dataKey: "producto" },
            { title: "Cantidad", dataKey: "cantidad" },
            {title: "Precio", dataKey:"precio"}
          ];
            let registros = this.productosVenta;
            let doc = new jsPDF("p", "pt");
            doc.autoTable(columns, registros, {
              margin: { top: 60 },
              addPageContent: function () {
                doc.text("Usuarios", 40, 30);
              },
            });
            doc.save("Usuarios.pdf");
          },

        editItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },
        deleteItem(item) {
            this.editedIndex = this.desserts.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },
        deleteItemConfirm() {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
            this.deleteProductos();
        },
        close() {
            this.dialog = false;
            this.dialogv = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
        closeDelete() {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },
        save() {
            if (this.editedIndex > -1) {
                Object.assign(this.desserts[this.editedIndex], this.editedItem);
                this.updateProductos();
            }
            else {
                this.desserts.push(this.editedItem);
                this.crearProducto();
            }
            this.close();
        },
        clear() {
            this.desserts = [];
        }
    },
};
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
td{
  text-align: center;
}
.msgdelete{
  text-align: center;
}
.nproducto{
  width: 40%;
  margin-left: 1%;
  margin-bottom: 1.5%;
}

.toolbar{
  max-height: 95%;
  width: 70%;
  margin: 1% 1% 1% 1% ;
  float: left;
}
.compras{
  width: 26%;
  float: right;
  margin: 1% 1% 1% 1% ;
  min-height: 95%;
}
.btnventa{
  width: 15%;
  float: right;
  margin-right: 1%;
}
.cardventa{
  width: 40%;
  margin: 0 auto;
}
</style>
