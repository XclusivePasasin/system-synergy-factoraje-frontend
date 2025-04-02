import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SidebarProvider {
  private toggleSubject: BehaviorSubject<boolean>;

  constructor() {
    // Inicializa el BehaviorSubject con el valor de localStorage o un valor por defecto (false)
    const storedToggle = localStorage.getItem('toggle');
    const initialValue = storedToggle ? JSON.parse(storedToggle) : false;
    this.toggleSubject = new BehaviorSubject<boolean>(initialValue);
  }

  // Actualiza el valor del toggle tanto en localStorage como en el BehaviorSubject
  public setToggle(toggle: boolean): void {
    localStorage.setItem('toggle', JSON.stringify(toggle));
    this.toggleSubject.next(toggle);
  }

  // Devuelve el observable para que los componentes puedan suscribirse a los cambios
  public getToggle() {
    return this.toggleSubject.asObservable();
  }
}
