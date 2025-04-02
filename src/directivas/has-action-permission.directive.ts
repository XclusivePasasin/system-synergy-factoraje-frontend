import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { LocalStorageProvider } from '../providers/local-storage.provider';

@Directive({
    selector: '[appHasAction]',
    standalone: true
})
export class HasActionPermission {
    private actionName!: string;

    @Input()
    set appHasAction(actionName: string) {
        this.actionName = actionName;
        this.updateView();
    }

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private storageProvider: LocalStorageProvider
    ) { }

    private updateView(): void {
        // Aquí puedes implementar la lógica para validar los permisos.
        // Por ahora, dejaré un placeholder.
        const hasPermission = this.checkPermission(this.actionName);

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

    private checkPermission(actionName: string): boolean {
        // Obtén las acciones correspondientes al tipo 'ACCION'
        const acciones = this.flattenMenus(this.storageProvider.menuSession ?? [])
            .filter(accion => accion.menu.descripcion === 'ACCION');


        // Verifica si existe una acción con el nombre que buscas
        const exist = acciones.some(accion => accion.menu.menu === actionName);

        // Devuelve true si existe, false en caso contrario
        return exist;
    }


    flattenMenus(menus: any[]): any[] {
        return menus.flatMap(menu =>
            menu.children
                ? [menu, ...this.flattenMenus(menu.children)] // Aplanar recursivamente los hijos
                : [menu] // Si no hay hijos, devolver el elemento actual
        );
    }
}
