import { Component, OnInit } from '@angular/core';
import { SynergyProvider } from '../../providers/synergy.provider';
import { Solicitud } from '../../models/solicitud.model';
import { FiltrosComponent } from '../../components/filtros/filtros.component';
import { TablaSolicitudesComponent } from '../../components/tabla-solicitudes/tabla-solicitudes.component';
import { MessageService } from 'primeng/api';
import { SharedComponent } from '../../components/shared/shared.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { Usuario, UsuarioOne } from '../../models/usuario.model';
import { SidebarProvider } from '../../providers/sidebar.provider';
import { LocalStorageProvider } from '../../providers/local-storage.provider';
import { CommonModule } from '@angular/common';
import { HasActionPermission } from '../../directivas/has-action-permission.directive';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  providers: [SynergyProvider],
  imports: [CommonModule,FiltrosComponent, TableModule, RouterModule, HasActionPermission, DialogModule, ButtonModule],
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  filtros: any = {};  // Aquí guardamos los filtros seleccionados
  loading = false;
  totalPages = 0;  // Total de páginas disponibles
  page = 1;         // Página inicial
  perPage = 10;     // Registros por página
  currentUserId: string | null = null;
  loadingUserId: string | null = null;
  modalAccionVisible: boolean = false;
  userToDelete!: Usuario;

  constructor(
    private sidebarProvider: SidebarProvider,
    private synergyProvider: SynergyProvider,
    private storageProvider: LocalStorageProvider,
    private router: Router,
    private messageService: MessageService,
  ) {}

  ngOnInit() {
    this.sidebarProvider.setToggle(true);
    this.loadCurrentUser();
    this.loadUsuarios();
  }


  loadUsuarios(){
    this.loading = true;
    this.synergyProvider.getUsers().then(
      (response)=>{
        this.usuarios = response.data.usuarios;
        console.log(this.usuarios)
      },
      (error)=>{
        console.error('Error al cargar usuarios:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la lista de usuarios.' });
      }
    ).finally(() => {
      this.loading = false;
    });
  }

  loadCurrentUser() {
    // Suponiendo que el ID del usuario en sesión se encuentra en LocalStorageProvider
    this.currentUserId = this.storageProvider.userIDSession || null;
    console.log('ID del usuario actual:', this.currentUserId);
  }

  applyFilters(filtros: any) {
    console.log("Data: ",filtros)
    this.filtros = filtros;  // Actualizamos los filtros
    this.page = 1;  // Resetear a la primera página
     // Recargamos las solicitudes con los nuevos filtros
  }

  onPageChange(event: any) {
    this.page = event.page + 1;  // Ajuste en caso de que la API sea 1-indexed
     // Recargar las solicitudes con la nueva página
  }

  onSearch(event:any){
    console.log(event)
  }

  navigateTo(route: string) {
    console.log('Navigating to:', route);
    this.router.navigate([route]);
  }

  toggleUserStatus(usuario: Usuario): void {
    // Determinar el nuevo estado
    const nuevoEstado = usuario.activo === true ? false : true;

    // Establecer el ID del usuario que está siendo actualizado para mostrar el spinner
    this.loadingUserId = usuario.id?.toString() || null;

    // Llamar al endpoint para actualizar el estado
    this.synergyProvider.updateUserStatusById(usuario.id?.toString() || '', nuevoEstado).then(
      (response) => {
        // Actualizar el estado del usuario en el arreglo local
        const index = this.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index].activo = nuevoEstado;
        }

        const mensaje = response.data?.mensaje || 'Operación completada exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
    .catch(err => {
        console.error('Error al cambiar el estado del usuario:', err);
        const mensajeError = err.message || 'No se pudo actualizar el estado del usuario.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      }
    ).finally(() => {
      // Restablecer el estado de carga
      this.loadingUserId = null;
    });
  }

  editarUsuario(usuario: any): void {
    this.router.navigate(['admin/usuarios/editar', usuario.id]);
  }

  ejecutarAccion(usuario: Usuario){
    this.modalAccionVisible = true;
    this.userToDelete = usuario;
  }

  deleteUser(): void {
    // Asegurarse de que el ID no es null o undefined
    this.modalAccionVisible = false;
    let usuario = this.userToDelete;
    if (!usuario.id) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El usuario no tiene un ID válido.' });
      return;
    }

    // Mostrar el estado de carga para este usuario
    this.loadingUserId = usuario.id.toString();

    // Llamar al método del provider para eliminar el usuario
    this.synergyProvider.deleteUserStatusById(usuario.id.toString())
      .then(response => {
        // Eliminar el usuario de la lista local
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);

        // Mostrar un mensaje de éxito
        const mensaje = response.data?.mensaje || 'El usuario ha sido eliminado exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
      .catch(error => {
        console.error('Error al eliminar el usuario:', error);
        const mensajeError = error.message || 'No se pudo eliminar el usuario.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      })
      .finally(() => {
        // Restablecer el estado de carga
        this.loadingUserId = null;
      });
  }

}
