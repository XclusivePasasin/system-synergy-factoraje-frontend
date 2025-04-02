import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageProvider } from '../../providers/local-storage.provider';
import { SidebarProvider } from '../../providers/sidebar.provider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  permisos: any[] | null = [];

  @Input() visible: boolean = true; // Por defecto false, luego lo ajustamos en ngOnInit

  constructor(private storageProv: LocalStorageProvider, private sidebarProvider: SidebarProvider) {
    this.permisos = this.storageProv.menuSession;
    console.log(this.permisos)
  }

  ngOnInit(): void {

    this.sidebarProvider.getToggle().subscribe((resp)=>{
      console.log(resp);
          // Determinar el ancho de la pantalla al cargar
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      // Pantallas pequeñas: cerrado
      this.visible = resp;
    } else {
      // Pantallas grandes: abierto
      this.visible = resp;
    }
    })

  }

  shouldShowMenu(item: any): boolean {
    const excludedMenus = [2, 5, 9, 12]; // IDs de los menús que no deben mostrarse sin hijos
    const hasSubmenu = item.children?.some(
      (subItem: any) => subItem.menu.descripcion === 'MENU' || subItem.menu.descripcion === 'SUBMENU'
    );
    
    // Mostrar el menú solo si no está excluido o tiene submenús válidos
    return !(excludedMenus.includes(item.menu.id) && !hasSubmenu);
  }
  

  toggleSidebar() {
    this.visible = !this.visible;
  }

  closeSidebar() {
    this.visible = false;
  }

  toggleMenu(item: any) {
    if (item.children?.length) {
      item.isOpen = !item.isOpen;
    }
  }
}
