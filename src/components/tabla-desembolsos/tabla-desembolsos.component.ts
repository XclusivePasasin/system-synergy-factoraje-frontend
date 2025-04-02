import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { desembolso } from '../../models/Desembolsos.model.'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-tabla-desembolsos ',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, PaginatorModule,],
  templateUrl: './tabla-desembolsos.component.html',
  styleUrls: ['./tabla-desembolsos.component.scss'],
})
export class TablasDesembolsosComponents implements OnInit {
  @Input() desembolso: desembolso[] = [];  // Recibimos las solicitudes del componente padre
  selectedSolicitudes: desembolso[] = []; // Almacena las solicitudes seleccionadas
  cols: any[] = [];
  loading: boolean = false;

  constructor(private router: Router) { } // Inyectar Router

  ngOnInit(): void {
    // Definición de columnas con tipos de filtros
    this.cols = [
      { field: 'factura.proveedor.razon_social', header: 'Cliente', filterType: 'text' },
      { field: 'factura.proveedor.correo_electronico', header: 'Correo', filterType: 'text' },
      { field: 'factura.proveedor.nrc', header: 'NRC Emisor', filterType: 'text' },
      { field: 'nombre_cliente', header: 'Encargado', filterType: 'text' },
      { field: 'factura.proveedor.telefono', header: 'Teléfono', filterType: 'text' },
      { field: 'factura.monto', header: 'Monto', filterType: 'text' },
      { field: 'interes', header: 'Interés', filterType: 'text' },
    ];
  }

  onPageChange(event: any): void {
    console.log('Cambio de página:', event);
    // Aquí puedes emitir eventos o hacer algo con la página seleccionada
  }

  // Método para redirigir al detalle de la solicitud
  verSolicitud(solicitud: any): void {
    // Redirigir a la ruta de detalle de la solicitud, pasando el id de la solicitud
    this.router.navigate(['solicitudes/detalle', solicitud.id]);
  }

  // Metodo para verificar si hay solicitudes aprobadas 
  tieneSolicitudesAprobadas(): boolean {
    return this.desembolso.some(s => s.estado === 'PROCESADAS');
  }

  tieneSolicitudesDenegadas(): boolean {
    return this.desembolso.some(s => s.estado === 'PAGADAS');
  }

  // Método para obtener las solicitudes seleccionadas
  obtenerSolicitudesSeleccionadas(): void {
    console.log("Solicitudes seleccionadas:", this.selectedSolicitudes);
  }

}
