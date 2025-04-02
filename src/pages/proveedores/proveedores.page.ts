import { Component, OnInit } from '@angular/core';
import { SynergyProvider } from '../../providers/synergy.provider';
import { Proveedor } from '../../models/proveedor.model';
import { FiltrosComponent } from '../../components/filtros/filtros.component';
import { TablaSolicitudesComponent } from '../../components/tabla-solicitudes/tabla-solicitudes.component';
import { MessageService } from 'primeng/api';
import { SharedComponent } from '../../components/shared/shared.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { SidebarProvider } from '../../providers/sidebar.provider';
import { LocalStorageProvider } from '../../providers/local-storage.provider';
import { CommonModule } from '@angular/common';
import { HasActionPermission } from '../../directivas/has-action-permission.directive';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.page.html',
  styleUrls: ['./proveedores.page.scss'],
  standalone: true,
  providers: [SynergyProvider],
  imports: [CommonModule, FiltrosComponent, TableModule, RouterModule, DialogModule, ButtonModule],
})
export class ProveedoresPage implements OnInit {
  proveedores: Proveedor[] = [];
  filtros: any = {};  // Aquí guardamos los filtros seleccionados
  loading = false;
  totalPages = 0;  // Total de páginas disponibles
  page = 1;         // Página inicial
  perPage = 10;     // Registros por página
  currentUserId: string | null = null;
  loadingUserId: string | null = null;
  modalAccionVisible: boolean = false;
  proveedorToDelete!: Proveedor;

  constructor(
    private sidebarProvider: SidebarProvider,
    private synergyProvider: SynergyProvider,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.sidebarProvider.setToggle(false);
    this.loadProveedores();
  }

  loadProveedores(){
    this.loading = true;
    this.synergyProvider.getProveedores().then(
      (response)=>{
        this.proveedores = response.data.proveedores;
        console.log(this.proveedores);
      },
      (error)=>{
        console.error('Error al cargar proveedores:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de proveedores.' });
      }
    ).finally(() => {
      this.loading = false;
    });
  }

  applyFilters(filtros: any) {
    console.log("Data: ", filtros);
    this.filtros = filtros;  // Actualizamos los filtros
    this.page = 1;  // Resetear a la primera página
  }

  onPageChange(event: any) {
    this.page = event.page + 1;  // Ajuste en caso de que la API sea 1-indexed
  }

  onSearch(event:any){
    console.log(event);
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  ejecutarAccion(proveedor: Proveedor){
    this.modalAccionVisible = true;
    this.proveedorToDelete = proveedor;
  }

  editarProveedor(proveedor: any): void {
    this.router.navigate(['admin/proveedores/editar', proveedor.id]);
  }

  deleteProveedor(): void {
    this.modalAccionVisible = false;
    let proveedor = this.proveedorToDelete;
    if (!proveedor.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El proveedor no tiene un ID válido.' });
      return;
    }

    this.loadingUserId = proveedor.id.toString();

    this.synergyProvider.deleteProveedorStatusById(proveedor.id.toString())
      .then(response => {
        this.proveedores = this.proveedores.filter(p => p.id !== proveedor.id);
        const mensaje = 'El proveedor ha sido eliminado exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
      .catch(error => {
        console.error('Error al eliminar el proveedor:', error);
        const mensajeError = error.message || 'No se pudo eliminar el proveedor.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      })
      .finally(() => {
        this.loadingUserId = null;
      });
  }
}