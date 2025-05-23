import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-modificar-menu',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HttpClientModule, MatCardModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h1>Modificar Menú</h1>
    
    <mat-card>
      <mat-card-title>Gestión del Menú Principal</mat-card-title>
      <mat-card-content>
        <div *ngIf="mensaje" style="color: green; margin-bottom: 10px;">{{mensaje}}</div>
        
        <mat-form-field style="width: 100%; margin-bottom: 20px;">
          <mat-label>Filtrar por categoría</mat-label>
          <mat-select [(ngModel)]="categoriaFiltro" (selectionChange)="filtrarPorCategoria()">
            <mat-option value="">Todas las categorías</mat-option>
            <mat-option value="1">Hamburguesas</mat-option>
            <mat-option value="2">Hot Dogs</mat-option>
            <mat-option value="3">Entradas</mat-option>
            <mat-option value="4">Bebidas</mat-option>
            <mat-option value="5">Postres</mat-option>
          </mat-select>
        </mat-form-field>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
          <div *ngFor="let producto of productosFiltrados" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <h3>{{producto.nombre}}</h3>
            <p><strong>Precio:</strong> {{producto.precio | currency:'USD'}}</p>
            <p><strong>Descripción:</strong> {{producto.descripcion}}</p>
            <p><strong>Stock:</strong> {{producto.stock}}</p>
            <p><strong>Categoría:</strong> {{producto.categoria_nombre || 'Sin categoría'}}</p>
            
            <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">
              <button mat-button color="primary" (click)="editarPrecio(producto)">
                Cambiar Precio
              </button>
              <button mat-button color="accent" (click)="editarStock(producto)">
                Actualizar Stock
              </button>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class ModificarMenuComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categoriaFiltro = '';
  mensaje = '';
  
  editandoPrecio = false;
  editandoStock = false;
  productoEditando: any = null;
  nuevoPrecio = 0;
  nuevoStock = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any[]>('http://localhost/Cooters/api/productos.php').subscribe({
      next: (data) => {
        this.productos = data;
        this.filtrarPorCategoria();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  filtrarPorCategoria() {
    if (this.categoriaFiltro) {
      this.productosFiltrados = this.productos.filter(p => p.categoria_id == this.categoriaFiltro);
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }

  editarPrecio(producto: any) {
    this.productoEditando = producto;
    this.nuevoPrecio = producto.precio;
    this.editandoPrecio = true;
  }

  editarStock(producto: any) {
    this.productoEditando = producto;
    this.nuevoStock = producto.stock;
    this.editandoStock = true;
  }

  guardarPrecio() {
    const datos = {
      id: this.productoEditando.id,
      nombre: this.productoEditando.nombre,
      precio: this.nuevoPrecio,
      descripcion: this.productoEditando.descripcion,
      categoria_id: this.productoEditando.categoria_id,
      stock: this.productoEditando.stock
    };

    this.http.put('http://localhost/Cooters/api/productos.php', datos).subscribe({
      next: (response: any) => {
        this.mensaje = 'Precio actualizado correctamente';
        this.cargarProductos();
        this.cancelarEdicion();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => console.error('Error al actualizar precio:', err)
    });
  }

  guardarStock() {
    const datos = {
      id: this.productoEditando.id,
      nombre: this.productoEditando.nombre,
      precio: this.productoEditando.precio,
      descripcion: this.productoEditando.descripcion,
      categoria_id: this.productoEditando.categoria_id,
      stock: this.nuevoStock
    };

    this.http.put('http://localhost/Cooters/api/productos.php', datos).subscribe({
      next: (response: any) => {
        this.mensaje = 'Stock actualizado correctamente';
        this.cargarProductos();
        this.cancelarEdicion();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => console.error('Error al actualizar stock:', err)
    });
  }

  toggleEstado(producto: any) {
    const nuevoEstado = producto.activo ? 0 : 1;
    // Implementar API para cambiar estado activo/inactivo
    this.mensaje = `Producto ${nuevoEstado ? 'activado' : 'desactivado'}`;
    setTimeout(() => this.mensaje = '', 3000);
  }

  cancelarEdicion() {
    this.editandoPrecio = false;
    this.editandoStock = false;
    this.productoEditando = null;
    this.nuevoPrecio = 0;
    this.nuevoStock = 0;
  }
}
