import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'; // Importar DropdownModule de PrimeNG
import { SynergyProvider } from '../../../providers/synergy.provider';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageProvider } from '../../../providers/local-storage.provider';
import { SidebarProvider } from '../../../providers/sidebar.provider';
import { Roles } from '../../../models/roles.model';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
  standalone: true,
  providers: [SynergyProvider],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    DropdownModule
  ]
})
export class ConfiguracionesPage implements OnInit {
  loading: boolean = false;
  loadingret: boolean = false;
  // Variables para el formulario
  correo: string = '';
  nombre: string = '';
  apellido: string = '';
  password: string = '';
  id_rol: string = ''; // Este se envía al backend, será el id del rol seleccionado
  passwordVisible: boolean = false;
  edit: boolean = false;
  back: boolean = false;
  setting: boolean = false;

  roles: Roles[] = [];
  selectedRole: Roles | null = null;

  constructor(
    private synergyProvider: SynergyProvider,
    private sidebarProvider: SidebarProvider,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private storageProvider: LocalStorageProvider,
    private location: Location,
  ) {}

  async ngOnInit() {
    if (this.route.snapshot.routeConfig?.path) {
      this.typeRoute(this.route.snapshot.routeConfig.path);
    }

    const tipo = this.route.snapshot.routeConfig?.path;

    // Cargar roles y datos del usuario en paralelo si es una edición
    if (tipo === 'usuarios/editar/:id') {
      await Promise.all([this.getAllRoles(), this.dataFetchUser()]);
      this.assignUserRole();
    } else {
      // Sólo cargar roles si no es edición
      await this.getAllRoles();
    }
  }

  loadSave() {
    this.loading = true;

    setTimeout(() => {
        this.loading = false
    }, 2000);
  }

  loadReset(){
    this.loadingret = true;

    setTimeout(() => {
        this.loadingret = false
    }, 2000);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async getAllRoles() {
    try {
      const response: any = await this.synergyProvider.getRoles();
      if (response && response.data && response.data.roles) {
        this.roles = response.data.roles;
      }
    } catch (error: any) {
      console.error("Error al obtener roles:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener la lista de roles.' });
    }
  }

  async dataFetchUser() {
    try {
      const userId = this.route.snapshot.paramMap.get('id');

      if (userId) {
        const response: any = await this.synergyProvider.getUserById(userId);
        console.log("Response: ", response);
        console.log("Data: ", response.data);

        // Acceder directamente a data
        this.nombre = response.data.nombres ?? '';
        this.apellido = response.data.apellidos ?? '';
        this.correo = response.data.email ?? '';

        const userRoleId = response.data.id_rol || null;
        if (userRoleId) {
          this.id_rol = userRoleId.toString();
        }
      }
    } catch (error: any) {
      console.error("Error al obtener el usuario:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || "Error al cargar el usuario.",
      });
    }
  }

  assignUserRole() {
    if (this.id_rol && this.roles.length > 0) {
      this.selectedRole = this.roles.find(r => r.id_rol === parseInt(this.id_rol)) || null;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo asignar el rol al usuario.' });
    }
  }

  typeRoute(tipo: string) {
    if (tipo === 'ajustes') {
      this.edit = true;
      this.setting = true;
      console.log("Vista de ajustes");
      this.nombre = this.storageProvider.userNameSession ? this.storageProvider.userNameSession : 'Desconocido';
      this.apellido = this.storageProvider.userLastNameSession ? this.storageProvider.userLastNameSession : 'Desconocido';
      this.correo = this.storageProvider.userEmailSession ? this.storageProvider.userEmailSession : 'Desconocido';
      this.id_rol = this.storageProvider.userIDRolSession ? this.storageProvider.userIDRolSession : '0';

    } else if (tipo === 'usuarios/editar/:id') {
      this.sidebarProvider.setToggle(false);
      this.edit = true;
      this.back = true;
      console.log("Vista de editar usuario");
    } else {
      this.sidebarProvider.setToggle(false);
      this.edit = false;
      this.back = true;
      console.log("Vista de crear usuario");
      this.nombre = '';
      this.apellido = '';
      this.correo = '';
      this.selectedRole = null;
    }
  }

  modificarInfo() {
    this.loadSave();

    if (this.setting) {
      // if (this.setting && this.password && this.password.length < 6) {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña debe tener al menos 6 caracteres.' });
      //   return;
      // }

      // if (this.edit && !this.setting && this.password && this.password.length < 6) {
      //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña debe tener al menos 6 caracteres si se modifica.' });
      //   return;
      // }

      this.synergyProvider.editUserById(
        this.storageProvider.userIDSession!,
        this.nombre,
        this.apellido,
        this.password || undefined,
        this.id_rol
      )
      .then((response) => {
        if(this.setting){
          this.storageProvider.userNameSession = this.nombre;
          this.storageProvider.userLastNameSession = this.apellido;
        }
        const mensaje = response.data?.mensaje || 'Operación completada exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
      .catch(err => {
        const mensajeError = err.message || 'No se pudo actualizar el usuario para reestablecer contraseña.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      });
      return;
    }

    if (this.edit) {
      if (!this.correo || !this.nombre || !this.apellido) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios.' });
        return;
      }

      if (!this.selectedRole) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un rol.' });
        return;
      }

      this.id_rol = this.selectedRole.id_rol.toString();

      this.synergyProvider.editUserById(
        this.route.snapshot.paramMap.get('id')!,
        this.nombre,
        this.apellido,
        undefined,
        this.id_rol
      )
      .then((response) => {
        const mensaje = response.data?.mensaje || 'Operación completada exitosamente.';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
      })
      .catch(err => {
        const mensajeError = err.message || 'No se pudo actualizar el usuario para reestablecer contraseña.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
      });
      return;
    }
    if (!this.correo || !this.nombre || !this.apellido) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Todos los campos son obligatorios.' });
      return;
    }

    if (!this.selectedRole) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar un rol.' });
      return;
    }

    this.id_rol = this.selectedRole.id_rol.toString();

    this.synergyProvider.createUser(
      this.nombre,
      this.apellido,
      this.correo,
      this.id_rol
    )
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario creado correctamente, las credenciales se han enviado al correo electrónico ingresado.' });
        this.nombre = '';
        this.apellido = '';
        this.correo = '';
        this.selectedRole = null;
      })
      .catch(err => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message || 'No se pudo crear el usuario.' });
      });
  }

  reestablecerPass() {
    this.loadReset();
    console.log("Se hizo clic");
    if (this.edit) {
      this.synergyProvider.resetUserById(this.route.snapshot.paramMap.get('id')!)
        .then((response) => {
          const mensaje = response.data?.mensaje || 'Operación completada exitosamente.';
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: mensaje });
        })
        .catch(err => {
          const mensajeError = err.message || 'No se pudo actualizar el usuario para reestablecer contraseña.';
          this.messageService.add({ severity: 'error', summary: 'Error', detail: mensajeError });
        });
      return;
    }
  }

  regresarALaLista() {
    this.location.back();
  }
}
