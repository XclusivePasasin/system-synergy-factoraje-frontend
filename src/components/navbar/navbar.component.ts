import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SynergyProvider } from '../../providers/synergy.provider';
import { LocalStorageProvider } from '../../providers/local-storage.provider';
import { SidebarProvider } from '../../providers/sidebar.provider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MenubarModule, BreadcrumbModule],
  providers: [SynergyProvider, LocalStorageProvider],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() name: string = '';
  @Input() lastName: string = ''; // Apellido del Usuario
  @Input() fullName: string = ''; // Nombre completo del Usuario
  @Input() role: string = '';
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();
  toggle = true;

  breadcrumbs: MenuItem[] = [];
  isDropdownOpen = false;
  showBienvenido: boolean = true; // Muestra BIENVENIDO inicialmente

  constructor(
    private synergyProvider: SynergyProvider,
    private storageProvider: LocalStorageProvider,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private sidebarProvider: SidebarProvider
  ) {
    this.name = this.storageProvider.userNameSession ? this.storageProvider.userNameSession : 'Desconocido';
    this.lastName = this.storageProvider.userLastNameSession ? this.storageProvider.userLastNameSession : 'Desconocido';
    this.role = this.storageProvider.userRolSession ? this.storageProvider.userRolSession : 'Desconocido';
    
    this.fullName = `${this.name} ${this.lastName}`;

  }

  ngOnInit() {
    // Mostrar BIENVENIDO por 3 segundos, luego cambiar a SINERGY
    setTimeout(() => {
      this.showBienvenido = false;
    }, 3000);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumbs(this.activatedRoute.root);
      });
  }

  private buildBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      if (child.outlet === PRIMARY_OUTLET) {
        const routeSnapshot = child.snapshot;
        const breadcrumbData = routeSnapshot.data['breadcrumb'];
        const path = routeSnapshot.url.map(segment => segment.path).join('/');
        const nextUrl = path ? `${url}/${path}` : url;

        if (breadcrumbData) {
          // Si el breadcrumb es un arreglo, divídelo en varios elementos
          if (Array.isArray(breadcrumbData)) {
            breadcrumbData.forEach((breadcrumb: string, index: number) => {
              breadcrumbs.push({
                label: breadcrumb,
                routerLink: index === breadcrumbData.length - 1 ? nextUrl : undefined, // El último tiene el enlace
              });
            });
          } else {
            // Si no es un arreglo, es un string y se agrega normalmente
            breadcrumbs.push({ label: breadcrumbData, routerLink: nextUrl });
          }
        }

        return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
      }
    }

    return breadcrumbs;
  }

  get userInitial(): string {
    return this.fullName.charAt(0).toUpperCase();
  }

  onToggleSidebar() {
    // this.toggleSidebar.emit();
    this.toggle = !this.toggle;
    this.sidebarProvider.setToggle(this.toggle);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    const id_usuario = this.storageProvider.userIDSession;
    if (id_usuario) {
      this.synergyProvider.logout(Number.parseInt(id_usuario)).then(
        (response) => {
          this.storageProvider.clearSession();
          this.messageService.add({
            severity: 'success',
            summary: 'Cierre de sesión',
            detail: 'Has cerrado sesión exitosamente',
          });
          this.router.navigate(['/login']);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Cierre de sesión',
            detail: 'Hubo un problema al cerrar la sesión',
          });
        }
      );
    }
  }
}
