import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:4200/api/pedidos';

  constructor(private http: HttpClient) {}

  realizarPedido(productos: { nombre: string; precio: number; cantidad: number }[]) {
    return this.http.post(this.apiUrl, {
      productos: productos
    });
  }
}
