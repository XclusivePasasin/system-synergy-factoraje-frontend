import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SharedComponent } from '../../../components/shared/shared.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SynergyProvider } from '../../../providers/synergy.provider';
import { Solicitud } from '../../../models/solicitud.model';
import { Currency, sortMenus } from '../../../utility/global.util';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { LocalStorageProvider } from '../../../providers/local-storage.provider';
import { Estados } from '../../../models/enums/global.enum';
import { SidebarProvider } from '../../../providers/sidebar.provider';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { PermissionNode } from '../../../models/usuario.model';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Permiso, DataPermiso, Menu } from '../../../providers/interface-http';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-accesos-edit',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule,
    FormsModule,
    TagModule,
    CardModule,
    InputTextModule,
    InputTextareaModule,
    ListboxModule,
    InputSwitchModule,
    TabViewModule
  ],
  providers: [SynergyProvider],
  templateUrl: './accesos-edit.page.html',
  styleUrls: ['./accesos-edit.page.scss']
})


export class AccesosEditPage implements OnInit {
  menus: any[] = [];
  acciones: any[] = [];
  accionesFiltradas: any[] = []
  selectedMenuId: number | null = 1; // El ID del menú "Panel"


  permisos: Permiso[] = [];
  id: number | null = null;
  nombre: string = "";
  descripcion: string = "";
  selectedPermisos!: Permiso[];
  filteredMenus: any[] = []

  permisosPanel = [
    {
      id_menu: 1, //Panel
      view_perm: 0
    },
    {
      id_menu: 2, //Solicitudes
      view_perm: 0,
      approve_deny: 0
    },
    {
      id_menu: 5, //Desembolsos
      view_perm: 0,
      process: 0
    },
    {
      id_menu: 7, //Ajustes
      view_perm: 0,
      edit_perm: 0
    },
    {
      id_menu: 8, //Administracion
      edit_user: 0,
      create_user: 0,
      active_inactive_user: 0,
      edit_role: 0,
      create_role: 0
    },
    {
      id_menu: 9, //Reportes
      view_perm: 0,
      donwload: 0
    }
  ]

  // permisos = {
  //   id_rol: null,
  //   nombre: null,
  //   descripcion: null,
  //   permisos: [
  //     {
  //       id_menu: 1, //Panel
  //       view_perm: 0
  //     },
  //     {
  //       id_menu: 2, //Solicitudes
  //       view_perm: 0,
  //       approve_deny: 0
  //     },
  //     {
  //       id_menu: 5, //Desembolsos
  //       view_perm: 0,
  //       process: 0
  //     },
  //     {
  //       id_menu: 7, //Ajustes
  //       view_perm: 0,
  //       edit_perm: 0
  //     },
  //     {
  //       id_menu: 8, //Administracion
  //       edit_user: 0,
  //       create_user: 0,
  //       active_inactive_user: 0,
  //       edit_role: 0,
  //       create_role: 0
  //     },
  //     {
  //       id_menu: 9, //Reportes
  //       view_perm: 0,
  //       donwload: 0
  //     }
  //   ]
  // }



  constructor(
    private sharedComponent: SharedComponent,
    private router: Router,
    private route: ActivatedRoute,
    private synergyProvider: SynergyProvider,
    private messageService: MessageService,
    private storageProvider: LocalStorageProvider,
    private location: Location,
    private sidebarProvider: SidebarProvider,
  ) { }

  async ngOnInit() {
    try {
      const idRol = this.route.snapshot.paramMap.get('id');

      // Obtener los menús disponibles
      const reponse_menus = (await this.synergyProvider.getMenus()).data?.menus ?? [];
      console.log(reponse_menus)
      this.menus = sortMenus(reponse_menus)
      this.acciones = (this.flattenMenus(this.menus).filter(menu=>menu.description == 'ACCION'))

      let permisos_actuales = [];
      if (idRol) {
        // Modo Editar: Obtener permisos actuales del rol
        const responseRole = await this.synergyProvider.getRole(idRol);
        permisos_actuales = responseRole.data?.permisos ?? [];
        this.id = responseRole.data?.id_rol ?? null;
        this.nombre = responseRole.data?.nombre ?? '';
        this.descripcion = responseRole.data?.descripcion ?? '';

        // Obtener los IDs de los menús activos para marcarlos como seleccionados
        const activeMenuIds = permisos_actuales.map(menu => menu.id_menu);
        this.menus = this.markMenusAsChecked(this.menus, activeMenuIds);
      } else {
        // Modo Nuevo: Inicializar permisos actuales como vacío
        permisos_actuales = [];
      }





    } catch (error: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }
  }


  // Método para marcar menús recursivamente
  markMenusAsChecked(menus: any[], activeMenuIds: any[]): any[] {
    return menus.map(menu => {
      // Si el ID está en la lista de activos, marcar como checked
      if (activeMenuIds.includes(menu.id)) {
        menu.checked = true;
      }

      // Si tiene hijos, aplicar la recursión
      if (menu.children && menu.children.length > 0) {
        menu.children = this.markMenusAsChecked(menu.children, activeMenuIds);
      }

      return menu;
    });
  }

  guardarRol() {


    const payload = {
      id_rol: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      menus: this.getCheckedItems().map(item => item.id)
    }

    console.log(payload)
    this.synergyProvider.updateRol(payload).then(
      (resp) => {
        this.messageService.add({ severity: 'success', summary: 'Guardar Rol', detail: "Se guardo el rol correctamente" });
      },
      (error) => {
        this.messageService.add({ severity: 'error', summary: 'Guardar Rol', detail: error.message });
      }
    )
  }

  filtrarAcciones(event:any){
    this.accionesFiltradas = [];
    if(event.target){
      
      let idpadre = event.target.value as Number;
      console.log(idpadre, this.acciones)
      this.accionesFiltradas =  this.acciones.filter((accion)=>accion.padre == idpadre);
      console.log(this.accionesFiltradas)
    }

    
  }

  getCheckedItems(): any[] {
    const flattenedMenus = this.flattenMenus(this.menus); // Aplana todos los menús
    return flattenedMenus.filter((item: any) => item.checked); // Filtra los elementos marcados
  }
  // Método para aplanar el menú
  flattenMenus(menus: any[]): any[] {
    return menus.flatMap(menu =>
      menu.children
        ? [menu, ...this.flattenMenus(menu.children)] // Aplanar recursivamente los hijos
        : [menu] // Si no hay hijos, devolver el elemento actual
    );
  }



  getFilteredPermisos(): Permiso[] {
    if (this.selectedMenuId === null) {
      return this.permisos ?? []; // Si no hay selección, muestra todos los permisos
    }
    const permisos = this.permisos.filter(permiso => permiso.id_menu === this.selectedMenuId) ?? [];

    return permisos;
  }

  onMenuSelect(event: any): void {

    this.selectedMenuId = event.value.menu.id; // Asegúrate de que `event.value` contiene el objeto del menú seleccionado
    this.selectedPermisos = this.getFilteredPermisos();
  }

  filterPermisosByPanel(permisos: Permiso[], permisosPanel: any[]): Permiso[] {
    return permisos.map(permiso => {
      const panelPermiso = permisosPanel.find(panel => panel.id_menu === permiso.id_menu);
      if (panelPermiso) {
        const filteredPermiso: any = { id_menu: permiso.id_menu }; // Mantener id_menu obligatorio
        Object.keys(panelPermiso).forEach(key => {
          if (key in permiso) {
            filteredPermiso[key] = (permiso as any)[key]; // Conserva el valor de permiso
          }
        });
        return filteredPermiso;
      }
      return permiso; // Si no está en permisosPanel, retorna el permiso sin modificar
    });
  }





  getKeys(obj: any): string[] {
    return Object.keys(obj).filter(key => key !== 'id_menu'); // Excluye atributos que no desees mostrar
  }

  isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  translateKey(key: string): string {
    const translations: { [key: string]: string } = {
      create_perm: 'Crear',
      edit_perm: 'Editar',
      delete_perm: 'Eliminar',
      view_perm: 'Ver',
      approve_deny: 'Aprobar/Rechazar',
      download: 'Descargar',
      process: 'Procesar',
      edit_user: 'Editar usuario',
      create_user: 'Crear usuario',
      active_inactive_user: 'Activar/Inactivar usuario',
      edit_role: 'Editar rol',
      create_role: 'Crear rol'
    };

    return translations[key] || key; // Si no encuentra la traducción, devuelve la clave original
  }



  // Función para redirigir a /roles
  regresarALaLista() {
    this.location.back();
  }
}
