import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-filtros-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
  ],
  templateUrl: './filtros-panel.component.html',
  styleUrls: ['./filtros-panel.component.scss']
})
export class FiltrosPanelComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }
  rangeDates: Date[] | null = null; // Rango de fechas seleccionado
  placeholder: string = 'Desde - Hasta'; // Texto del placeholder
  filtros: any = {};

  @ViewChild('calendar') calendar!: Calendar;
  @Output() filtersChanges = new EventEmitter<any>();

    // Cargar solicitudes según los filtros
    loadSolicitudesPanel() {
      console.log('Filtros aplicados:', this.filtros);
      // Aquí podrías hacer una llamada HTTP para obtener las solicitudes filtradas
      this.filtersChanges.emit(this.filtros); // Emitir los filtros al componente padre
    }

    // Actualizar el texto del rango de fechas
    actualizarRangoTexto() {
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
        const formatter = new Intl.DateTimeFormat('es-ES', options);
        this.placeholder = `${formatter.format(this.rangeDates[0])} - ${formatter.format(this.rangeDates[1])}`;
      } else {
        this.placeholder = 'Seleccionar rango de fechas';
      }
    }

    // Limpiar el rango de fechas
    clearRangoTexto() {
      this.rangeDates = null;
      this.placeholder = 'Seleccionar rango de fechas';
      this.filtros = {}; // Limpiar cualquier filtro adicional
      this.filtersChanges.emit(this.filtros); // Emitir filtros vacíos
      this.closeCalendar();
    }

    aplicarSeleccion() {
      if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
        // Formatear las fechas al formato YYYY-MM-DD
        const fechasFormateadas = this.rangeDates.map(fecha => {
          return fecha.toISOString().split('T')[0]; // Extraer solo la parte de la fecha (YYYY-MM-DD)
        });

        this.filtersChanges.emit({
          fecha_inicio: fechasFormateadas[0],
          fecha_fin: fechasFormateadas[1],
          ...this.filtros, // Incluir los filtros adicionales (estado)
        });
      } else {
        console.log('No se ha seleccionado un rango de fechas.');
        this.messageService.add({ severity: 'warn', summary: 'Seleccionar Fechas', detail: 'No se ha seleccionado un rango de fechas.' });
        this.filtersChanges.emit({}); // Emitir filtros vacíos
      }
      this.closeCalendar();
    }

    // Cerrar el calendario
    closeCalendar(): void {
      if (this.calendar) {
        this.calendar.hideOverlay();
        console.log('Calendar overlay closed.');
      }
    }


}
