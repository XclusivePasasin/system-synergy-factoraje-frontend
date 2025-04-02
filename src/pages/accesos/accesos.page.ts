import { Component, OnInit } from '@angular/core';
import { SynergyProvider } from '../../providers/synergy.provider';
import { TableModule } from 'primeng/table';
import { FiltrosComponent } from '../../components/filtros/filtros.component';
import { Roles } from '../../models/roles.model';
import { Router } from '@angular/router';
import { SharedComponent } from '../../components/shared/shared.component';
import { SidebarProvider } from '../../providers/sidebar.provider';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.page.html',
  styleUrls: ['./accesos.page.scss'],
  standalone: true,
  providers: [SynergyProvider],
  imports: [FiltrosComponent, TableModule, DialogModule, ButtonModule],
})
export class AccesosPage implements OnInit {
  roles: Roles[] = [];
  loading = false;
  modalAccionVisible: boolean = false;
  rolToDelete!: Roles;
  loadingRolId: string | null = null;

  constructor(
    private synergyProvider: SynergyProvider,
    private sidebarProvider: SidebarProvider,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.sidebarProvider.setToggle(true);
    this.synergyProvider.getRoles().then(
      (resp) => {
        this.roles = resp.data?.roles ?? []
      },
      (error) => {

      }
    )
  }

  gotoEdit(id: string) {

    this.sidebarProvider.setToggle(false);
    if (id == '0') {
      this.router.navigate(['admin/roles-permisos/nuevo']);
    } else {
      this.router.navigate(['admin/roles-permisos/editar', id]);
    }

  }

  ejecutarAccion(rol: Roles) {
    this.modalAccionVisible = true;
    this.rolToDelete = rol;
  }

  deleteRole(): void {
    // Asegurarse de que el ID no es null o undefined
    this.modalAccionVisible = false;
    let rol = this.rolToDelete;
    if (!rol.id_rol) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El usuario no tiene un ID válido.' });
      return;
    }



    // Llamar al método del provider para eliminar el usuario
    this.synergyProvider.deleteRole(rol.id_rol.toString())
      .then(response => {
        // Eliminar el usuario de la lista local
        this.roles = this.roles.filter(u => u.id_rol !== rol.id_rol);

        // Mostrar un mensaje de éxito
        const mensaje = 'El rol ha sido eliminado exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
      .catch(error => {
        console.error('Error al eliminar el rol:', error);
        const mensajeError = error.message || 'No se pudo eliminar el rol.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      });
  }

}
