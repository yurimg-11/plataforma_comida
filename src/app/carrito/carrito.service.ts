import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private _items: any[] = [];

  agregar(producto: any) {
  const existente = this._items.find(p => p.nombre === producto.nombre);
  if (existente) {
    existente.cantidad = (existente.cantidad || 1) + 1;
  } else {
    this._items.push({ ...producto, cantidad: 1 });
  }
}

  limpiar() {
    this._items = [];
  }

  obtenerProductos(): any[] {
    return this._items;
  }
}
