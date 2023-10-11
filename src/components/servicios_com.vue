<template>
    <v-data-table 
      :headers="  headers"
      :items="desserts"
      height="calc(80vh)"
      items-per-page="-1"
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
                      <td>{{ producto.servicio }}</td>
                      <td>
                    <input
                      type="number"
                      v-model="producto.cantidad"
                      @input="subtotalVenta(producto)"
                    />
                  </td>
                      <td>{{ producto.precio }}</td>
                      <td>{{ producto.subtotal}}</td>
                    </tr>
                </tbody>
            </v-table>
            <v-divider thickness="4"></v-divider>
            <div class="totalcontainer">
                      <p class="totaltxt">Total</p>
                      <p class="totaln">{{ totalSubtotals }}</p>
                    </div>
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
        v-model="dialogAdd">
          <v-card class="cardstock" title="Agregar Stock">
            <v-row no-gutters>
            <input type="number" v-model="stockN">
            </v-row>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="close()">Cancelar</v-btn>
              <v-btn @click="confirmAddStock()">Agregar</v-btn>
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
                class="btnnproducto"
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
                        v-model="editedItem.servicio"
                        label="Producto"
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
      <template  v-slot:[`item.actions`]="{ item }">
        <div style="margin-left: 53%;">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" class="me-2" @click="deleteItem(item.raw)">
          mdi-delete
        </v-icon>
        <v-icon size="small" @click="addStock(item.raw)" class="me-2">
          mdi mdi-plus-thick
        </v-icon>
        <v-icon size="small" @click="addToCompras(item.raw)" class="me-2">
          mdi mdi-cart
        </v-icon>
      </div>
      </template>
      <template v-slot:no-data>
      <v-progress-linear
      indeterminate
      color="#3B3236"
    ></v-progress-linear>
    </template>
    </v-data-table>
    <v-snackbar
    v-model="snbAdd"
    timeout="2000">
      <div style="text-align: center;">El servicio ya esta agregado</div>
    </v-snackbar>
  </template>
  <script >
  import db from '@/firebase/init'
  import { addDoc, collection, getDocs, query , updateDoc , doc, deleteDoc } from 'firebase/firestore'
  import jsPDF from 'jspdf';
  require('jspdf-autotable')
    export default {
      data: () => ({
          snbAdd:false,
          dialogAdd:false,
          dialogv:false,
          dialog: false,
          dialogDelete: false,
          headers: [
              {
                  title: 'Servicio',
                  align: 'start',
                  key: 'servicio',
              },
              { title: 'Descripcion', key: 'descripcion',sortable: false, },
              { title: 'Precio', key: 'precio',sortable: false, },
              { title: '', key: 'actions', sortable: false},
          ],
          desserts: [],
          editedIndex: -1,
          editedItem: {
              keyid: 0,
              servicio: '',
              descripcion: '',
              precio: 0,
          },
          defaultItem: {
              keyid:0,
              servicio: '',
              descripcion: '',
              precio: 0,
          },
          compras: [],
          headersCompras: [
              { title: 'Servicio', key: 'servicio' },
              { title: 'Cantidad', key: 'cantidad' },
              { title: 'Precio', key: 'precio' },
              { title: '', key: 'actions', sortable: false }
          ],
          counters: {},
          productosVenta:[],
          stockN:0,
      }),
      computed: {
          formTitle() {
              return this.editedIndex === -1 ? 'Nuevo Servicio' : 'Editar Servicio';
          },
          items() {
              return Array.from({ length: this.stock }, (v, i) => i + 1);
          },
          totalSubtotals() {
            return this.productosVenta.reduce((total, producto) => {
            return total + (parseInt(producto.cantidad) * parseInt(producto.precio));
            }, 0);
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
              const q = query(collection(db, 'servicio'));
              const result = await getDocs(q);
              result.forEach((doc) => {
                  this.desserts.push({
                      keyid: doc.id,
                      servicio: doc.data().servicio,
                      descripcion: doc.data().descripcion,
                      precio: doc.data().precio,
                  });
              });
          },
          async crearProducto() {
              const colRef = collection(db, 'servicio');
              const dataObj = {
                  servicio: this.editedItem.servicio,
                  descripcion: this.editedItem.descripcion,
                  precio: this.editedItem.precio,
              };
              const docRef = await addDoc(colRef, dataObj);
              console.log(docRef.id);
              this.clear();
              this.listarProductos();
          },
          async updateProductos() {
              const ref = doc(db, 'servicio', this.editedItem.keyid);
              await updateDoc(ref, {
                  servicio: this.editedItem.servicio,
                  descripcion: this.editedItem.descripcion,
                  precio: this.editedItem.precio,
              });
          },
          async deleteProductos() {
              await deleteDoc(doc(db, 'servicio', this.editedItem.keyid));
          },
          addToCompras(item) { 
            let ver = this.productosVenta.find((producto)=>item.keyid === producto.keyid)
            if (ver){
              this.snbAdd = true;
            } else  {
              let cantidad = 1
              let nuevaVenta = {
                keyid:item.keyid,
                servicio:item.servicio,
                cantidad:cantidad,
                precio:item.precio,
                subtotal:parseInt(item.precio)* parseInt(cantidad)
              }
              this.productosVenta.push(nuevaVenta)
            }
          },
          async confirmVenta(){
                const informeVenta = []
                this.productosVenta.forEach((servicio)=>{
                  const venta = {
                  producto:servicio.servicio,
                  cantidad:servicio.cantidad,
                  subtotal:servicio.cantidad*servicio.precio
                }
                informeVenta.push(venta)
                })
                const fecha = new Date();
          const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          };
          const fechaCompleta = fecha.toLocaleString('es-ES', options);
          const ref = collection(db, 'informes')
          const data = {
            fecha:fechaCompleta,
            productos:informeVenta,
            total:this.totalSubtotals,
            tipoVenta:'Servicio',
          }
          await addDoc(ref,data)
                this.close()
                this.clearVenta()
          },
          subtotalVenta(producto) {
          producto.subtotal = parseInt(producto.cantidad) * parseInt(producto.precio);
          },
          removeFromCompras(item) {
              this.compras = this.compras.filter(compra => compra.producto !== item.producto);
          },
  
          async generatePDF() {
    let columns = [
      { title: "", dataKey: "servicio" },
      { title: "", dataKey: "cantidad" },
      { title: "", dataKey: "precio" },
    ];
  
    let registros = this.productosVenta;
    let total = this.totalSubtotals;
  
    registros.forEach((registro) => {
      registro.cantidad = "         " + registro.cantidad; // Agrega espacios en blanco
      registro.precio = "         " + registro.precio; // Agrega espacios en blanco
    });
    total = "         " + total; // Agrega espacios en blanco
  
    let totalRow = { servicio: 'Total:', cantidad: "", precio: total };
    registros.push(totalRow);
  
    let doc = new jsPDF("p", "pt");
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  
    doc.text("<<<BIOTHERAPIA>>>", 200, 30);
    doc.text(`Fecha: ${formattedDate}`, 160, 50);
    doc.text(`Hora: ${formattedTime}`, 300, 50);
  
    doc.autoTable(columns, registros, {
      margin: { top: 70 },
  
    });
  
    if (confirm("¿Estás seguro de que deseas descargar el Informe de Venta?")) {
      doc.save(`Informe ${formattedDate}.pdf`);
    }
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
          addStock(item){
            this.dialogAdd = true;
            this.editedItem = Object.assign({}, item);
            this.stockN = 1
          },
          deleteItemConfirm() {
              this.desserts.splice(this.editedIndex, 1);
              this.closeDelete();
              this.deleteProductos();
          },
          close() {
              this.dialog = false;
              this.dialogv = false;
              this.dialogAdd = false;
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
          },
          clearVenta(){
            this.productosVenta=[]
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
    text-align: left;
  }
  .cardstock input{
    text-align: center;
    margin: 8px 0px auto;
  }
  .msgdelete{
    text-align: center;
  }
  .btnnproducto{
    width: 40%;
    margin-left: 1%;
    margin-bottom: 1.5%;
    background-color: #6B3236;
    color: white;
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
    background-color: #6B3236;
    color: white;
  }
  .cardventa{
    width: 80%;
    margin: 0 auto;
  }
  .cardstock{
    margin: 0 auto;
    display: grid;
    place-items: center;
  }
  .totalcontainer{
    display: flex;
    justify-content: space-between;
    margin-top: 5px; 
  }
  .totaltxt{
    padding-left: 15px;
  }
  .totaln{
    padding-right: 16px;
    width: 11.34%;
  }
  </style>