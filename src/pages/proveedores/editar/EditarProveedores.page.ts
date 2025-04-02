import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SynergyProvider } from '../../../providers/synergy.provider';
import { ActivatedRoute } from '@angular/router';
import { SidebarProvider } from '../../../providers/sidebar.provider';
import { Roles } from '../../../models/roles.model';

@Component({
  selector: 'app-editarProveedores',
  templateUrl: './editarProveedores.page.html',
  styleUrls: ['./editarProveedores.page.scss'],
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
export class EditarProveedores implements OnInit {
  loading: boolean = false;
  loadingret: boolean = false;

  // Variables del formulario de proveedor
  correo_electronico: string = '';
  razon_social: string = '';
  nrc: string = '';
  nit: string = '';
  telefono: string = '';
  nombre_contacto: string = '';
  cuenta_bancaria: string = '';
  minimo: string = '';
  maximo: string = '';
  banco: string = '';

  bancos: any[] = [
    { nombre: 'Banco Agrícola', codigo: '01' },
    { nombre: 'Banco de América Central', codigo: '02' },
    { nombre: 'Banco Cuscatlán', codigo: '03' },
    { nombre: 'Banco Promérica', codigo: '04' },
    { nombre: 'Banco Davivienda', codigo: '05' },
    { nombre: 'Banco Hipotecario', codigo: '06' },
  ];

  codigo_banco: string = '';
  id: string = '';

  passwordVisible: boolean = false;
  edit: boolean = false;
  back: boolean = false;

  roles: Roles[] = [];
  selectedRole: Roles | null = null;

  constructor(
    private synergyProvider: SynergyProvider,
    private sidebarProvider: SidebarProvider,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
  ) { }

  async ngOnInit() {
    this.sidebarProvider.setToggle(false);
    this.back = true;

    const tipo = this.route.snapshot.routeConfig?.path;
    if (tipo === 'proveedores/editar/:id') {
      this.edit = true;
      await this.dataFetchProveedor();
    }
  }

  loadSave() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onBancoChange(event: any) {
    const bancoSeleccionado = this.bancos.find(b => b.nombre === event.value);
    if (bancoSeleccionado) {
      this.codigo_banco = bancoSeleccionado.nombre;
    }
  }

  onCodigoChange(event: any) {
    const bancoSeleccionado = this.bancos.find(b => b.codigo === event.value);
    if (bancoSeleccionado) {
      this.banco = bancoSeleccionado.nombre;
    }
  }

  loadReset() {
    this.loadingret = true;
    setTimeout(() => {
      this.loadingret = false;
    }, 2000);
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  async dataFetchProveedor() {
    try {
      const userId = this.route.snapshot.paramMap.get('id');
      if (userId) {
        const response: any = await this.synergyProvider.getProveedorById(userId);

        // Asignación de campos del proveedor
        const proveedor = response.data.proveedor;
        this.razon_social = proveedor.razon_social ?? '';
        this.correo_electronico = proveedor.correo_electronico ?? '';
        this.nrc = proveedor.nrc ?? '';
        this.nit = proveedor.nit ?? '';
        this.telefono = proveedor.telefono ?? '';
        this.nombre_contacto = proveedor.nombre_contacto ?? '';
        this.cuenta_bancaria = proveedor.cuenta_bancaria ?? '';
        this.minimo = proveedor.min_factoring ?? '';
        this.maximo = proveedor.max_factoring ?? '';
        this.banco = proveedor.banco ?? '';
        this.codigo_banco = proveedor.codigo_banco ?? '';
        this.id = proveedor.id ?? '';
      }
    } catch (error: any) {
      console.error("Error al obtener el proveedor:", error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || "Error al cargar el proveedor.",
      });
    }
  }

  modificarInfo() {
    this.loadSave();

    // Validación de campos obligatorios
    if (!this.correo_electronico || !this.razon_social || !this.nrc || !this.nit ||
      !this.telefono || !this.nombre_contacto || !this.cuenta_bancaria ||
      !this.minimo || !this.maximo  || !this.codigo_banco) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Todos los campos obligatorios deben estar completos.'
      });
      return;
    }

    const bancoSeleccionado = this.bancos.find(b => b.codigo === this.codigo_banco);
    if (bancoSeleccionado) {
      this.banco = bancoSeleccionado.nombre;
    }

    if (this.edit) {
      // Editar proveedor existente
      this.synergyProvider.editProveedorById(
        this.route.snapshot.paramMap.get('id')!,
        this.razon_social,
        this.nrc,
        this.nit,
        this.correo_electronico,
        this.cuenta_bancaria,
        this.minimo,
        this.maximo,
        this.banco,
        this.codigo_banco,
        this.nombre_contacto,
        this.telefono
      )
        .then((response) => {
          const mensaje = response.data?.mensaje || 'Proveedor actualizado correctamente.';
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: mensaje,
            life: 2000 // Duración del mensaje en milisegundos (2 segundos)
          });
          // Esperar un poco para que el usuario vea el mensaje antes de redirigir
          setTimeout(() => {
            this.regresarALaLista();
          }, 2000);
        })
        .catch(err => {
          const mensajeError = err.message || 'No se pudo actualizar el proveedor.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensajeError
          });
        });
    } else {
      // Crear nuevo proveedor
      this.synergyProvider.createProveedor(
        this.id,
        this.razon_social,
        this.nrc,
        this.nit,
        this.correo_electronico,
        this.cuenta_bancaria,
        this.minimo,
        this.maximo,
        this.banco,
        this.codigo_banco,
        this.nombre_contacto,
        this.telefono
      )
        .then(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proveedor creado correctamente.',
            life: 2000
          });
          setTimeout(() => {
            this.resetForm();
          }, 2000);
        })
        .catch(err => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'No se pudo crear el proveedor.'
          });
        });
    }
  }
  resetForm() {
    this.razon_social = '';
    this.nrc = '';
    this.nit = '';
    this.telefono = '';
    this.nombre_contacto = '';
    this.cuenta_bancaria = '';
    this.minimo = '';
    this.maximo = '';
    this.banco = '';
    this.codigo_banco = '';
    this.id = '';
    this.correo_electronico = '';

  }

  regresarALaLista() {
    this.location.back();
  }
}