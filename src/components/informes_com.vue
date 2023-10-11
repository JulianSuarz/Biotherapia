<template>
    <v-table height="calc(100vh)">
        <div v-for="(productos,index) in desserts" :key="index" >
        <v-divider :thickness="4"></v-divider>
        <h4 class="fecha">{{ productos.fecha }}</h4>
        <v-table class="table">
            <thead>
                <tr>
                  <th style="width: 80%;">Producto</th>
                  <th style="width: 10%;">Cantidad</th>
                  <th style="width: 30%;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(producto,indeX) in productos.productos" :key="indeX">
                    <td>{{ producto.producto }}</td>
                    <td>{{ producto.cantidad }}</td>
                    <td style="text-align: right;padding-right: 5%;">{{ producto.subtotal}}</td>
                </tr>
                
              </tbody>
          </v-table>
          <div class="containertotal">
            <h4 class="totaltxt">Total:</h4>
          <h4 class="totaln">{{ productos.total }}</h4>
          </div>
    </div>    
    </v-table>
</template>
<script >
import db from '@/firebase/init'
import { collection, getDocs } from 'firebase/firestore'
  require('jspdf-autotable')
    export default {
      data: () => ({
          headers: [
              {
                  title: 'Producto',
                  align: 'start',
                  key: 'producto',
              },
              { title: 'Cantidad', key: 'cantidad',sortable: false, },
              { title: 'Subtotal', key: 'subtotal' },
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
              keyid:0,
              producto: '',
              descripcion: '',
              stock: 0,
              precio: 0,
          },
      }),
      computed: {
          formTitle() {
              return this.editedIndex === -1 ? 'Nuevo Producto' : 'Editar Producto';
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
          this.listarInformes();
      },
      methods: {
        async listarInformes(){
            const q = collection(db, 'informes');
            const result = await getDocs(q);
            result.forEach((doc) => {
                this.desserts.push({
                    keyid: doc.id,
                    productos: doc.data().productos,
                    cantidad:doc.data().cantidad,
                    subtotal:doc.data().subtotal,
                    fecha:doc.data().fecha,
                    total:doc.data().total
                });
            });
        },
      }
};
  </script> 
  <style scoped>
  .fecha{
    margin-top: 1%;
    text-align: center;
  }
  .containertotal{
    display: flex;
    justify-content: space-between;
    margin-bottom: 1%;
  }
  .totaln{
    text-align: center;
    padding-right: 5%;
  }
  .totaltxt{
    padding-left: 16px;
  }
  </style>