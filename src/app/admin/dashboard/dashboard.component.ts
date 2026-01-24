import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { ProductService } from '../../services/product.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {
    ventasTotales: 0,
    pedidosPendientes: 0,
    stockCritico: 0,
    totalProductos: 0
  };

  topProductos: any[] = [];
  chart: any;

  constructor(
    private adminService: AdminService,
    public productService: ProductService
  ) {}

  ngOnInit(): void {

    this.cargarEstadisticas();
    this.cargarTop5();
    this.cargarGraficaCategorias();
  }

  cargarEstadisticas() {
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; },
      error: (err) => console.error('Error al cargar estadísticas:', err)
    });
  }

  cargarTop5() {
    this.productService.getTop5Vendidos().subscribe({
      next: (data) => { this.topProductos = data; },
      error: (err) => console.error('Error al cargar top 5', err)
    });
  }

  cargarGraficaCategorias() {
    this.productService.getAllProducts().subscribe({
      next: (productos) => {
        const conteo: { [key: string]: number } = {};
        productos.forEach(p => {
          const catNombre = p.categoria?.nombre || 'Sin Categoría';
          conteo[catNombre] = (conteo[catNombre] || 0) + 1;
        });
        this.renderChart(Object.keys(conteo), Object.values(conteo));
      },
      error: (err) => console.error('Error al cargar gráfica:', err)
    });
  }

  renderChart(labels: string[], data: number[]) {

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('canvasCategorias', {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6610f2', '#0dcaf0'],
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } }
        }
      }
    });
  }
}



