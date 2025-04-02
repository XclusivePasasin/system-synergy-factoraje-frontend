import { Component, Input, Output, EventEmitter, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-filtros-avanzados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-filtros-avanzados.component.html',
  styleUrls: ['./modal-filtros-avanzados.component.scss'],
})
export class ModalFiltrosAvanzadosComponent implements AfterViewInit {
  @Input() mostrar = false; // Controla la visibilidad del modal
  @Output() cerrar = new EventEmitter<any>(); // Evento para notificar cierre del modal

  buttonPosition: { left: number; bottom: number } | null = null; // Posición del botón

  filtros = {
    proveedor: null,
    nombre_proveedor: null,
    nrc: null,
    telefono: null,
    email: null,
    no_factura: null,
  }

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.updateModalPosition();
  }

  limpiarFiltros() {
    console.log('Filtros limpiados');
    this.  filtros = {
      proveedor: null,
      nombre_proveedor: null,
      nrc: null,
      telefono: null,
      email: null,
      no_factura: null,
    }
    this.cerrar.emit({}); // Notifica que se cierra el modal
  }

  aplicarFiltros() {
    // Filtrar solo las propiedades que no son null o undefined
    const filtrosAplicados = Object.fromEntries(
      Object.entries(this.filtros).filter(([key, value]) => value !== null && value !== undefined)
    );

    console.log('Filtros aplicados: ', filtrosAplicados);
    this.cerrar.emit(filtrosAplicados); // Emitir los filtros no nulos
  }

  cerrarModal() {
    this.cerrar.emit(); // Notifica que se cierra el modal
  }

  updateModalPosition() {
    const button = this.elementRef.nativeElement.querySelector('.open-modal-button');
    if (button) {
      const rect = button.getBoundingClientRect();
      this.buttonPosition = { left: rect.left, bottom: rect.bottom };
    } else {
      this.buttonPosition = null; // Explicita cuando no se encuentra el botón
    }
  }

}
