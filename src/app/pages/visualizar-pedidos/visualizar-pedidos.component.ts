import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

interface Pedido {
  id: number;
  cliente: string;
  fecha: string;
  total: number;
  estado: string;
}

interface DetallePedido {
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-visualizar-pedidos',
  standalone: true,
  imports: [
    MatCardModule, MatButtonModule, MatSelectModule, CommonModule, FormsModule,
    MatSidenavModule, MatListModule, MatIconModule, MatToolbarModule
  ],
  templateUrl: './visualizar-pedidos.component.html',
  styleUrls: ['./visualizar-pedidos.component.css']
})
export class VisualizarPedidosComponent implements OnInit, OnDestroy {
  pedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  filtroEstado: string = '';
  mensaje: string = '';
  pedidoDetalle: any = null;
  mostrarModal: boolean = false;
  private intervalId: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarPedidos();
    this.intervalId = setInterval(() => this.cargarPedidos(), 10000); // Polling cada 10s
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  cargarPedidos() {
    this.http.get<any[]>('http://localhost/Cooters/api/pedidos.php').subscribe({
      next: (data) => {
        this.pedidos = data;
        this.filtrarPedidos();
        this.mensaje = '';
      },
      error: (error) => {
        this.mensaje = 'No se pudieron cargar los pedidos. Verifica la conexión con el servidor.';
      }
    });
  }

  filtrarPedidos() {
    if (this.filtroEstado) {
      this.pedidosFiltrados = this.pedidos.filter(p => p.estado === this.filtroEstado);
    } else {
      this.pedidosFiltrados = [...this.pedidos];
    }
  }

  verDetalle(id: number) {
    this.router.navigate(['/detalle-pedido', id]);
  }

  aceptarPedido(id: number) {
    this.http.put('http://localhost/Cooters/api/pedidos.php', { id, estado: 'aceptado' }).subscribe({
      next: () => this.cargarPedidos(),
      error: (error) => {
        this.mensaje = 'No se pudo aceptar el pedido.';
      }
    });
  }

  rechazarPedido(id: number) {
    this.http.put('http://localhost/Cooters/api/pedidos.php', { id, estado: 'rechazado' }).subscribe({
      next: () => this.cargarPedidos(),
      error: (error) => {
        this.mensaje = 'No se pudo rechazar el pedido.';
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.pedidoDetalle = null;
  }
}
