import { CurrencyPipe } from '@angular/common';
import { Menu, Permission, PermissionNode } from '../models/usuario.model';

export class Currency {
  private static currencyPipe = new CurrencyPipe('en-US'); // Configura el locale según tu región

  static format(value: number | undefined, currencyCode: string = 'USD'): string {
    if (value == undefined) {
      return '0.00';
    }
    return this.currencyPipe.transform(value, currencyCode, 'symbol', '1.2-2') || '';
  }
}

export class Email {
  static isValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
}

export class MenuPermisssion {

  static format(permisos: Permission[]): PermissionNode[] {
    // Filtrar los permisos cuya descripción sea "MENU"
    const permisosFiltrados = permisos;
  
    // Crear un mapa de todos los permisos filtrados por su ID
    const permisoMap: { [key: number]: PermissionNode } = {};
  
    permisosFiltrados.forEach(permiso => {
      permisoMap[permiso.menu.id] = { ...permiso, children: [] };
    });
  
    // Crear la estructura jerárquica
    const raiz: PermissionNode[] = [];
  
    permisosFiltrados.forEach(permiso => {
      const nodo = permisoMap[permiso.menu.id];
      if (permiso.menu.padre === 0) {
        // Si no tiene padre, es raíz
        raiz.push(nodo);
      } else {
        // Si tiene padre, lo añadimos a sus hijos
        const padre = permisoMap[permiso.menu.padre];
        if (padre) {
          padre.children.push(nodo);
        }
      }
    });
  
    return this.ordenarNodos(raiz);
  }

  // Ordenar nodos recursivamente por 'orden'
  static ordenarNodos(nodos: PermissionNode[]): PermissionNode[] {
    return nodos
      .sort((a, b) => a.menu.orden - b.menu.orden)
      .map(nodo => ({
        ...nodo,
        children: this.ordenarNodos(nodo.children)
      }));
  }

}


//Ordenar menu para roles y permisos

interface MenuROL {
  id: number;
  menu: string;
  padre: number | null;
  orden: number | null;
  [key: string]: any;
}

export function sortMenus(menus: any[]): any[] {
  // Crear un mapa para agrupar los menús por su padre
  const menuMap = new Map<number | null, MenuROL[]>();

  menus.forEach(menu => {
      const parentId = menu.padre;
      if (!menuMap.has(parentId)) {
          menuMap.set(parentId, []);
      }
      menuMap.get(parentId)?.push(menu);
  });

  // Ordenar los menús por el campo 'orden'
  menus.forEach(menuGroup => {
      menuMap.get(menuGroup.padre)?.sort((a, b) => {
          if (a.orden === null) return 1;
          if (b.orden === null) return -1;
          return a.orden - b.orden;
      });
  });

  // Función recursiva para construir la jerarquía
  function buildHierarchy(parentId: number | null): MenuROL[] {
      return (menuMap.get(parentId) || []).map(menu => {
          return {
              ...menu,
              children: buildHierarchy(menu.id) // Añadir hijos recursivamente
          };
      });
  }

  // Construir la jerarquía desde los elementos sin padre
  return buildHierarchy(0); // 0 es el ID del nivel raíz en este caso
}




