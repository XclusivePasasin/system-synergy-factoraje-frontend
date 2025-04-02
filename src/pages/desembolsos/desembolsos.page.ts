import { Component, OnInit } from '@angular/core';
import { SynergyProvider } from '../../providers/synergy.provider';
import { Solicitud } from '../../models/solicitud.model';
import { desembolso } from '../../models/Desembolsos.model.';
import { FiltrosComponent } from '../../components/filtros/filtros.component';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SidebarProvider } from '../../providers/sidebar.provider';
import { TablasDesembolsosComponents } from '../../components/tabla-desembolsos/tabla-desembolsos.component';

@Component({
  selector: 'app-desembolsos',
  templateUrl: './desembolsos.page.html',
  styleUrls: ['./desembolsos.page.scss'],
  standalone: true,
  providers: [SynergyProvider],
  imports: [FiltrosComponent, TablasDesembolsosComponents],
})
export class DesembolsosPage implements OnInit {
  desembolsos: desembolso[] = [];  // Asegúrate de que sea un arreglo de tipo Solicitud
  filtros: any = {};  // Aquí guardamos los filtros seleccionados
  loading = false;
  totalPages = 0;  // Total de páginas disponibles
  page = 1;         // Página inicial
  perPage = 10;     // Registros por página

  constructor(
    private sidebarProvider: SidebarProvider,
    private synergyProvider: SynergyProvider,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    // Abrir el sidebar al cargar la página
    this.sidebarProvider.setToggle(false)
    if(this.route.snapshot.routeConfig?.path){
      console.log(this.route.snapshot.routeConfig?.path)
      this.typeRoute(this.route.snapshot.routeConfig.path);
    }
    // // Cargar solicitudes al inicio
    // this.loadSolicitudes();
  }

  typeRoute(tipo:string){
    if(tipo=='procesadas'){
      this.filtros={estado: 6}
    }else if(tipo=='pagadas'){
      this.filtros={estado: 7}
    }else{
      this.filtros={estado: 5}
    }
    this.loadDesembolsos();
  }

  /**
   * Método para cargar las solicitudes desde el servicio
   * con los filtros aplicados.
   */
  async loadDesembolsos(page: number = this.page, perPage: number = this.perPage) {
    this.desembolsos = [];
    this.loading = true;
    try {
      const response = await this.synergyProvider.getRequestDesem(page, perPage, this.filtros);
      // Asegúrate de que 'solicitudes' sea un arreglo
      if (response && response.data && Array.isArray(response.data.desembolsos)) {
        this.desembolsos = response.data.desembolsos;
        this.totalPages = response.data.total_pages || 0;  // Usamos total_pages para la paginación
      } else {
        this.desembolsos = [];  // Si no es un array, inicializamos con un array vacío
        this.totalPages = 0;
      }
    } catch (error:any) {
      this.messageService.add({ severity: 'error', summary: 'Error al obtener la solicitud', detail: error.message });
      console.error('Error al obtener solicitudes', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Método que recibe los filtros desde el componente FiltrosComponent
   */
  applyFilters(filtros: any) {
    console.log("Data: ",filtros)
    this.filtros = filtros;  // Actualizamos los filtros
    this.page = 1;  // Resetear a la primera página
    this.loadDesembolsos();  // Recargamos las solicitudes con los nuevos filtros
  }

  /**
   * Método que maneja la paginación
   */
  onPageChange(event: any) {
    this.page = event.page + 1;  // Ajuste en caso de que la API sea 1-indexed
    this.loadDesembolsos();  // Recargar las solicitudes con la nueva página
  }
}
