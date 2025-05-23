import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private productos: any[] = [];

  obtenerProductos() {
    return this.productos;
  }

  agregarProducto(producto: any) {
    this.productos.push(producto);
  }

  limpiarCarrito() {
    this.productos = [];
  }
}
