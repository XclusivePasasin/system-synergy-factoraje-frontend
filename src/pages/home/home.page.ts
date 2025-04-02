import { Component, OnInit } from '@angular/core';
import { FiltrosPanelComponent } from '../../components/filtros/filtros-panel/filtros-panel.component';
import { CommonModule } from '@angular/common';
import { SynergyProvider } from '../../providers/synergy.provider';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [SynergyProvider],
  imports: [FiltrosPanelComponent, CommonModule, RouterModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  filtros: any = {};
  loading = false;
  totalSolicitudes: number = 0;
  aprobadas: number = 0;
  sinAprobar: number = 0;
  denegadas: number = 0;

  constructor(private synergyProvider: SynergyProvider, private messageService: MessageService) {}

  async ngOnInit() {
    await this.loadSolicitudesPanel();
  }

    /**
   * Método que recibe los filtros desde el componente FiltrosComponent
   */
    applyFilters(filtros: any) {
      console.log("Data: ",filtros)
      this.filtros = filtros;  // Actualizamos los filtros
      this.loadSolicitudesPanel();  // Recargamos las solicitudes con los nuevos filtros
    }

  /**
   * Fetch data from an endpoint
   */
  async loadSolicitudesPanel() {
    this.loading = true;

    try {
      const response = await this.synergyProvider.getRequestPanel(this.filtros);

      // Validar si la estructura de la respuesta es la esperada
      if (response && response.data) {
        // Ajuste para acceder directamente a las propiedades de `data`
        this.totalSolicitudes = response.data.total_solicitudes || 0;
        this.sinAprobar = response.data.solicitudes_sin_aprobar || 0;
        this.aprobadas = response.data.solicitudes_aprobadas || 0;
        this.denegadas = response.data.solicitudes_denegadas || 0;
      } else {
        // Manejo en caso de que `data` esté ausente
        this.messageService.add({
          severity: 'warn',
          summary: 'Datos incompletos',
          detail: 'No se encontraron datos en la respuesta de la API.'
        });
        console.warn('Estructura inesperada en la respuesta:', response);
      }
    } catch (error: any) {
      // Manejo de errores
      this.messageService.add({
        severity: 'error',
        summary: 'Error al obtener las métricas',
        detail: error.message
      });
      console.error('Error al obtener solicitudes:', error);
    } finally {
      this.loading = false;
    }
    console.log('Fetching data from provider...');
  }
  onPageChange(event: any) {
    this.loadSolicitudesPanel();
  }
}
