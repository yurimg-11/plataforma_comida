import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-gestion-productos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule
  ],
  template: `
    <h1>Gestión de Productos</h1>
    
    <!-- Formulario para agregar/editar producto -->
    <mat-card style="margin-bottom: 20px;">
      <mat-card-title>{{editando ? 'Editar' : 'Agregar'}} Producto</mat-card-title>
      <mat-card-content>
        <form (ngSubmit)="guardarProducto()">
          <mat-form-field style="width: 100%; margin-bottom: 10px;">
            <mat-label>Nombre</mat-label>
            <input matInput [(ngModel)]="productoForm.nombre" name="nombre" required>
          </mat-form-field>
          
          <mat-form-field style="width: 100%; margin-bottom: 10px;">
            <mat-label>Precio</mat-label>
            <input matInput type="number" [(ngModel)]="productoForm.precio" name="precio" required>
          </mat-form-field>
          
          <mat-form-field style="width: 100%; margin-bottom: 10px;">
            <mat-label>Descripción</mat-label>
            <textarea matInput [(ngModel)]="productoForm.descripcion" name="descripcion"></textarea>
          </mat-form-field>
          
          <mat-form-field style="width: 100%; margin-bottom: 10px;">
            <mat-label>Categoría</mat-label>
            <mat-select [(ngModel)]="productoForm.categoria_id" name="categoria_id">
              <mat-option value="1">Hamburguesas</mat-option>
              <mat-option value="2">Hot Dogs</mat-option>
              <mat-option value="3">Entradas</mat-option>
              <mat-option value="4">Bebidas</mat-option>
              <mat-option value="5">Postres</mat-option>
            </mat-select>
          </mat-form-field>
          
          <mat-form-field style="width: 100%; margin-bottom: 10px;">
            <mat-label>Stock</mat-label>
            <input matInput type="number" [(ngModel)]="productoForm.stock" name="stock">
          </mat-form-field>
          
          <button mat-raised-button color="primary" type="submit">
            {{editando ? 'Actualizar' : 'Agregar'}}
          </button>
          <button mat-button type="button" (click)="cancelarEdicion()" *ngIf="editando">
            Cancelar
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <!-- Lista de productos -->
    <mat-card>
      <mat-card-title>Lista de Productos</mat-card-title>
      <mat-card-content>
        <div *ngIf="mensaje" style="color: green; margin-bottom: 10px;">{{mensaje}}</div>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; border: 1px solid #ddd;">Nombre</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Precio</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Categoría</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Stock</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let producto of productos">
              <td style="padding: 10px; border: 1px solid #ddd;">{{producto.nombre}}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">\${{producto.precio}}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">{{producto.categoria_nombre}}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">{{producto.stock}}</td>
              <td style="padding: 10px; border: 1px solid #ddd;">
                <button mat-button color="accent" (click)="editarProducto(producto)">Editar</button>
                <button mat-button color="warn" (click)="eliminarProducto(producto.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .gestion-productos-container {
      max-width: 700px;
      margin: auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
  `]
})
export class GestionProductosComponent implements OnInit {
  productos: any[] = [];
  productoForm = {
    id: null,
    nombre: '',
    precio: 0,
    descripcion: '',
    categoria_id: 1,
    stock: 0
  };
  editando = false;
  mensaje = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<any[]>('http://localhost/Cooters/api/productos.php').subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  guardarProducto() {
    const url = 'http://localhost/Cooters/api/productos.php';
    const request = this.editando 
      ? this.http.put(url, this.productoForm)
      : this.http.post(url, this.productoForm);

    request.subscribe({
      next: (response: any) => {
        this.mensaje = response.message;
        this.cargarProductos();
        this.limpiarFormulario();
        setTimeout(() => this.mensaje = '', 3000);
      },
      error: (err) => console.error('Error al guardar producto:', err)
    });
  }

  editarProducto(producto: any) {
    this.productoForm = { ...producto };
    this.editando = true;
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.http.delete('http://localhost/Cooters/api/productos.php', { body: { id } }).subscribe({
        next: (response: any) => {
          this.mensaje = response.message;
          this.cargarProductos();
          setTimeout(() => this.mensaje = '', 3000);
        },
        error: (err) => console.error('Error al eliminar producto:', err)
      });
    }
  }

  cancelarEdicion() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.productoForm = {
      id: null,
      nombre: '',
      precio: 0,
      descripcion: '',
      categoria_id: 1,
      stock: 0
    };
    this.editando = false;
  }
}