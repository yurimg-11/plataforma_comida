import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="detalle-pedido-container">
      <h1>Detalle del Pedido #{{pedidoId}}</h1>
      
      <div *ngIf="pedido" style="display: grid; gap: 20px;">
        <!-- Información del pedido -->
        <mat-card>
          <mat-card-title>Información del Pedido</mat-card-title>
          <mat-card-content>
            <p><strong>ID:</strong> {{pedido.id}}</p>
            <p><strong>Cliente:</strong> {{pedido.cliente_nombre}}</p>
            <p><strong>Fecha:</strong> {{pedido.fecha_pedido | date:'dd/MM/yyyy HH:mm'}}</p>
            <p><strong>Estado:</strong>
              <span [ngClass]="{
                'estado-pendiente': pedido.estado === 'pendiente',
                'estado-aceptado': pedido.estado === 'aceptado',
                'estado-rechazado': pedido.estado === 'rechazado',
                'estado-completado': pedido.estado === 'completado'
              }">{{pedido.estado | titlecase}}</span>
            </p>
            <p><strong>Total:</strong> {{pedido.total | currency:'USD':'symbol':'1.2-2'}}</p>
          </mat-card-content>
        </mat-card>

        <!-- Productos del pedido -->
        <mat-card>
          <mat-card-title>Productos</mat-card-title>
          <mat-card-content>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Producto</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Precio Unit.</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Cantidad</th>
                  <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let detalle of detalles">
                  <td style="padding: 10px; border: 1px solid #ddd;">{{detalle.nombre_producto}}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">
                    {{detalle.precio | currency:'USD':'symbol':'1.2-2'}}
                  </td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">{{detalle.cantidad}}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">
                    {{detalle.subtotal | currency:'USD':'symbol':'1.2-2'}}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background-color: #f0f0f0; font-weight: bold;">
                  <td colspan="3" style="padding: 10px; border: 1px solid #ddd; text-align: right;">TOTAL:</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">
                    {{pedido.total | currency:'USD':'symbol':'1.2-2'}}
                  </td>
                </tr>
              </tfoot>
            </table>
          </mat-card-content>
        </mat-card>

        <!-- Acciones -->
        <mat-card *ngIf="pedido.estado === 'pendiente'">
          <mat-card-title>Acciones</mat-card-title>
          <mat-card-content>
            <div style="display: flex; gap: 10px;">
              <button mat-raised-button color="primary" (click)="cambiarEstado('aceptado')">
                Aceptar Pedido
              </button>
              <button mat-raised-button color="warn" (click)="cambiarEstado('rechazado')">
                Rechazar Pedido
              </button>
              <button mat-raised-button color="accent" (click)="cambiarEstado('completado')">
                Marcar como Completado
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <div style="margin-top: 20px;">
          <button mat-button (click)="volver()">← Volver a la lista de pedidos</button>
        </div>
      </div>

      <div *ngIf="!pedido && !cargando">
        <p>No se encontró el pedido.</p>
        <button mat-button (click)="volver()">← Volver</button>
      </div>

      <div *ngIf="cargando">
        <p>Cargando detalles del pedido...</p>
      </div>
    </div>
  `,
  styles: [`
    .estado-pendiente { color: #ff9800; font-weight: bold; }
    .estado-aceptado { color: #4caf50; font-weight: bold; }
    .estado-rechazado { color: #f44336; font-weight: bold; }
    .estado-completado { color: #2196f3; font-weight: bold; }
  `]
})
export class DetallePedidoComponent implements OnInit {
  pedidoId: number = 0;
  pedido: any = null;
  detalles: any[] = [];
  cargando = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.pedidoId = +params['id'];
      if (this.pedidoId) {
        this.cargarDetallePedido();
      }
    });
  }

  cargarDetallePedido() {
    this.cargando = true;
    
    // Cargar pedido
    this.http.get(`http://localhost/Cooters/api/pedido-detalle.php?id=${this.pedidoId}`).subscribe({
      next: (data: any) => {
        this.pedido = data.pedido;
        this.detalles = data.detalles;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar detalle del pedido:', err);
        this.cargando = false;
      }
    });
  }

  cambiarEstado(nuevoEstado: string) {
    if (confirm(`¿Estás seguro de ${nuevoEstado} este pedido?`)) {
      this.http.put('http://localhost/Cooters/api/pedidos.php', {
        id: this.pedidoId,
        estado: nuevoEstado
      }).subscribe({
        next: () => {
          this.cargarDetallePedido(); // Recargar para ver el cambio
        },
        error: (err) => console.error('Error al cambiar estado:', err)
      });
    }
  }

  volver() {
    this.router.navigate(['/visualizar-pedidos']);
  }
}