<template>
<v-table height="calc(93vh)">
  <div v-for="(productos,index) in desserts" :key="index">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title v-slot="{ open }">
        <v-row no-gutters>
          <v-col cols="4" class="d-flex justify-start">{{ productos.venta }} </v-col>
          <v-col cols="4" class="d-flex justify-start">{{ productos.fecha }} </v-col>
          <v-col cols="8" class="text--secondary">
            <v-fade-transition leave-absolute>
              <span v-if="open" key="0"> {{productos.venta}} </span>
            </v-fade-transition>
          </v-col>
          <v-col  class="d-flex justify-end">
              <v-btn class="pdfbuttoi" color="green" @click="printTable(index)">
                <v-icon>mdi mdi-file-download</v-icon>
              </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
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
      </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
  <v-btn color="green" @click="printAllTables()">
  <v-icon>mdi mdi-folder-download</v-icon>
  Imprimir todos los informes
</v-btn>
</v-table>
</template>
<script >
import db from '@/firebase/init'
import { collection, getDocs } from 'firebase/firestore'
import jsPDF from "jspdf";
import "jspdf-autotable";

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
          open:false,
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
        printTable(index) {
      const productos = this.desserts[index].productos;
      const totalVenta = this.desserts[index].total; 
      const doc = new jsPDF();

      const data = productos.map((producto) => [
        producto.producto,
        producto.cantidad,
        producto.subtotal,
      ]);
      data.push(["TOTAL DE VENTA", "", totalVenta]);

      doc.autoTable({
        head: [this.headers.map((header) => header.title)], 
        body: data,
        startY: 20, 
        showHead: "firstPage", 
      });

      doc.save("tabla-" + index + ".pdf");
    },
        async printAllTables() {
      const doc = new jsPDF();
      

      for (let index = 0; index < this.desserts.length; index++) {
        const productos = this.desserts[index].productos;
        const totalVenta = this.desserts[index].total;

        const data = productos.map((producto) => [
          producto.producto,
          producto.cantidad,
          producto.subtotal,
        ]);
        data.push(["TOTAL DE VENTA", "", totalVenta]);

        doc.autoTable({
          head: [this.headers.map((header) => header.title)],
          body: data,
          startY: 20,
          showHead: "firstPage",
        });

        if (index < this.desserts.length - 1) {
          doc.addPage(); 
        }
      }

      doc.save("todas-las-tablas.pdf");
    },
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
                    total:doc.data().total,
                    venta:doc.data().venta
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
    margin-top: 0.5%;
  }
  .totaln{
    text-align: center;
    padding-right: 5%;
  }
  .totaltxt{
    padding-left: 16px;
  }
  </style>