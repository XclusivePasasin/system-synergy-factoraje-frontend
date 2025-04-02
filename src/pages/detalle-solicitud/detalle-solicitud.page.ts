import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { SharedComponent } from '../../components/shared/shared.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SynergyProvider } from '../../providers/synergy.provider';
import { Solicitud } from '../../models/solicitud.model';
import { Currency } from '../../utility/global.util';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { LocalStorageProvider } from '../../providers/local-storage.provider';
import { Estados } from '../../models/enums/global.enum';
import { SidebarProvider } from '../../providers/sidebar.provider';
import { HasActionPermission } from '../../directivas/has-action-permission.directive';

@Component({
  selector: 'app-detalle-solicitud',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, DialogModule, FormsModule, TagModule, HasActionPermission],
  providers: [SynergyProvider],
  templateUrl: './detalle-solicitud.page.html',
  styleUrls: ['./detalle-solicitud.page.scss']
})
export class DetalleSolicitudPage implements OnInit {

  currentSolicitud!: Solicitud;
  loading = false;
  accion = "";

  cliente: string = '';
  aprobador: string = '';
  fecha: string = '';
  fechaAprobacion: string = '';
  fechaSolicitud: string = '';

  // Datos de la cesión de facturaje
  invoiceDetails: any = [];

  // Variables para manejar el modal de comentarios y acción
  comentario: string = '';
  modalComentarioVisible: boolean = false;
  modalAccionVisible: boolean = false;

  constructor(
    private sidebarProvider: SidebarProvider,
    private router: Router,
    private route: ActivatedRoute,
    private synergyProvider: SynergyProvider,
    private messageService: MessageService,
    private storageProvider: LocalStorageProvider,
    private location: Location
  ) { }

  async ngOnInit() {
    try {
      this.sidebarProvider.setToggle(false);
      const noSolicitud = this.route.snapshot.paramMap.get('id');

      if (noSolicitud) {
        const { data } = await this.synergyProvider.getDetailRequest(noSolicitud);
        console.log(data);
        if (data) {
          this.currentSolicitud = data.solicitud;
          this.setDetail();
        }
      }
    } catch (error: any) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    }


  }

  async setDetail() {

    const solicitud = this.currentSolicitud;
    this.invoiceDetails.push({ concept: 'Factura N.º', valor: solicitud.factura.no_factura });
    this.invoiceDetails.push({ concept: 'Fecha de Otorgamiento', valor: solicitud.factura.fecha_otorga });
    this.invoiceDetails.push({ concept: 'Fecha de Vencimiento', valor: solicitud.factura.fecha_vence });
    this.invoiceDetails.push({ concept: 'Monto de la Factura', valor: Currency.format(solicitud.factura.monto) });
    this.invoiceDetails.push({ concept: 'Descuento por Pronto Pago', valor: Currency.format(solicitud.factura.pronto_pago) });
    this.invoiceDetails.push({ concept: 'IVA', valor: Currency.format(solicitud.iva) });
    this.invoiceDetails.push({ concept: 'Subtotal del Descuento', valor: Currency.format(solicitud.subtotal) });
    this.invoiceDetails.push({ concept: 'Total a Recibir', valor: Currency.format(solicitud.total) });

    // Mostrar fechas según el estado de la solicitud
    if (solicitud.id_estado === Estados.Aprobada) {
      this.invoiceDetails.push({ concept: 'Fecha de Aprobación', valor: solicitud.fecha_aprobacion });
    } else if (solicitud.id_estado === Estados.Denegada) {
      this.invoiceDetails.push({ concept: 'Fecha de Denegación', valor: solicitud.fecha_aprobacion }); // Asumiendo que la fecha de denegación está en fecha_aprobacion
    }

    // Mostrar fecha de solicitud solo si está aprobada o denegada
    if (solicitud.id_estado === Estados.Aprobada || solicitud.id_estado === Estados.Denegada) {
      this.invoiceDetails.push({ concept: 'Fecha de Solicitud', valor: solicitud.fecha_solicitud });
      this.invoiceDetails.push({ concept: 'Comentario:', valor: solicitud.comentario });
    }
    this.cliente = solicitud.factura.proveedor?.razon_social ?? '';  // Asigna una cadena vacía si es undefined
    this.aprobador = this.storageProvider.userNameSession ? this.storageProvider.userNameSession : 'Desconocido';  // Asigna un valor predeterminado si es undefined
    this.fecha = new Date().toLocaleDateString();  // Asigna la fecha actual en formato "DD/MM/YYYY"
  }

  validarEstado() {
    const estado = this.currentSolicitud.id_estado;
    if (estado == Estados.Aprobada || estado == Estados.Denegada) {
      return false
    }
    return true;
  }


  // Mostrar modal para agregar comentario
  mostrarModalComentario() {
    this.modalComentarioVisible = true;
  }

  // Guardar comentario y cerrar modal
  guardarComentario() {
    console.log('Comentario guardado:', this.comentario);
    this.modalComentarioVisible = false;
  }

  // Cancelar comentario sin guardar
  cancelarComentario() {
    this.comentario = ''; // Limpiar el comentario
    this.modalComentarioVisible = false;
  }

  // Mostrar modal para confirmar acción
  confirmarSolicitud(accion: string) {
    this.modalAccionVisible = true;
    this.accion = accion;
  }

  // Ejecutar acción confirmada (en este ejemplo solo se registra en consola)
  ejecutarAccion() {
    if (this.accion == "aprobar") {
      this.loading = true;
      const id_aprobador = this.storageProvider.userIDSession as string;
      const id_usuario_bitacora = this.storageProvider.userIDSession as string;
      const name_User = this.storageProvider.userNameSession as string;
      const lastName_User = this.storageProvider.userLastNameSession as string;

      const nombre_usuario_bitacora = name_User + ' ' + lastName_User;
      this.synergyProvider.approveRequest(this.currentSolicitud.id.toString(), id_aprobador, this.comentario, id_usuario_bitacora, nombre_usuario_bitacora).then(
        (resp) => {
          this.messageService.add({ severity: 'success', summary: 'Aprobación', detail: "La solicitud se ha aprobado exitosamente." });
          this.loading = false;
          this.modalAccionVisible = false;
          setTimeout(() => {
            this.router.navigate(['/solicitudes/aprobadas']);
          }, 2000);
        },
        (err: any) => {
          console.log(err)
          this.loading = false;
          this.modalAccionVisible = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      )
    } else {
      this.loading = true;
      const id_aprobador = this.storageProvider.userIDSession as string;
      const id_usuario_bitacora = this.storageProvider.userIDSession as string;
      const name_User = this.storageProvider.userNameSession as string;
      const lastName_User = this.storageProvider.userLastNameSession as string;
      const nombre_usuario_bitacora = name_User + ' ' + lastName_User;
      
      this.synergyProvider.denyRequest(this.currentSolicitud.id.toString(), id_aprobador, this.comentario, id_usuario_bitacora, nombre_usuario_bitacora).then(
        (resp) => {
          this.messageService.add({ severity: 'success', summary: 'Denegación', detail: "La solicitud se ha denegado exitosamente." });
          this.loading = false;
          this.modalAccionVisible = false;
          setTimeout(() => {
            this.router.navigate(['/solicitudes/denegadas']);
          }, 2000);
        },
        (err: any) => {
          console.log(err)
          this.loading = false;
          this.modalAccionVisible = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message });
        }
      )
    }
  }

  // Cancelar acción sin ejecutarla
  cancelarAccion() {
    this.modalAccionVisible = false;
  }

  // Denegar solicitud (en este ejemplo solo se registra en consola)
  denegarSolicitud(accion: string) {
    this.modalAccionVisible = true;
    this.accion = accion;
  }

  // Función para redirigir a /solicitudes
  regresarALaLista() {
    this.location.back();
  }
}
