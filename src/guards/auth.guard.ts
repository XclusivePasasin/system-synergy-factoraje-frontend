import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LocalStorageProvider } from '../providers/local-storage.provider';
import { PermissionNode } from '../models/usuario.model';

@Injectable({
    providedIn: 'root'
})
export class AuthGuardApp implements CanActivate {
    constructor(private storeProv: LocalStorageProvider, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = this.storeProv.jwtSession; // Validar si el usuario tiene sesión activa

        if (!token) {
          this.router.navigate(['/login']); // Redirigir si no hay sesión
          return false;
        }

        // // Obtener permisos del usuario como una estructura jerárquica
        const userPermissions = this.storeProv.menuSession ? this.storeProv.menuSession : [];

        // // Ruta solicitada
        const requestedRoute = state.url;
        console.log(requestedRoute)

        // // Verificar si la ruta pertenece a los permisos del usuario
         const hasPermission = this.hasPermission(userPermissions, requestedRoute);

        if (hasPermission) {
           return true; // Permitir el acceso si tiene permisos
         } else {
           this.router.navigate(['/no-autorizado']); // Redirigir si no tiene permisos
           return false;
         }
        return true;
      }

      private hasPermission(nodes: PermissionNode[], route: string): boolean {
        // Expresión regular para detectar rutas con un ID al final (por ejemplo, /editar/1)
        const routeWithoutId = route.replace(/\/\d+$/, '');
        console.log(routeWithoutId)
    
        for (const node of nodes) {
            // Verificar si el nodo actual tiene la ruta sin ID
            if (node.menu.path === routeWithoutId) {
                return true;
            }
    
            // Verificar si los hijos del nodo tienen la ruta sin ID
            if (node.children && this.hasPermission(node.children, routeWithoutId)) {
                return true;
            }
        }
    
        return false; // No tiene permisos para la ruta
    }
    
    }


