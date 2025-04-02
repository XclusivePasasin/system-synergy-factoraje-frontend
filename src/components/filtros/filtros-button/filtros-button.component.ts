import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtros-button',
  standalone: true,
  templateUrl: './filtros-button.component.html',
  styleUrls: ['./filtros-button.component.scss']
})
export class FiltrosButtonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Output() abrirModal = new EventEmitter<void>();

  abrirFiltrosAvanzados() {
    this.abrirModal.emit();
  }

}
