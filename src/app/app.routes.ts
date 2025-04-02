import { Routes } from '@angular/router';
import { HomePage } from '../pages/home/home.page';
import { SolicitudesPage } from '../pages/solicitudes/solicitudes.page';
import { LoginPage } from '../pages/auth/login/login.page';
import { SharedComponent } from '../components/shared/shared.component';
import { SolicitudProntoPagoPage } from '../pages/landingpages/solicitud-prontopago/solicitud-prontopago.page';
import { AuthGuardApp } from '../guards/auth.guard';
import { PublicGuard } from '../guards/public.guard';
import { DetalleSolicitudPage } from '../pages/detalle-solicitud/detalle-solicitud.page';
import { UnAuthorizedPage } from '../pages/auth/no-autorizado/no-autorizado.page';
import { UsuariosPage } from '../pages/usuarios/usuarios.page';
import { AccesosPage } from '../pages/accesos/accesos.page';
import { AccesosEditPage } from '../pages/accesos/edit/accesos-edit.page';
import { ConfiguracionesPage } from '../pages/usuarios/configuraciones/configuraciones.page';
import { DesembolsosPage } from '../pages/desembolsos/desembolsos.page';
import { ProveedoresPage } from '../pages/proveedores/proveedores.page';
import { EditarProveedores } from '../pages/proveedores/editar/EditarProveedores.page';

export const routes: Routes = [
  {
    path: '',
    component: SharedComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomePage,
        canActivate: [AuthGuardApp],
        //data: { breadcrumb: 'Panel' }
      },
      {
        path: 'solicitudes',
        data: { breadcrumb: 'Solicitudes' },
        canActivate: [AuthGuardApp],
        children: [
          {
            path: 'aprobadas',
            component: SolicitudesPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Aprobadas' },
          },
          {
            path: 'sin-aprobar',
            component: SolicitudesPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Sin Aprobar' },
          },
          {
            path: 'denegadas',
            component: SolicitudesPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Denegadas' },
          },
          {
            path: 'detalle/:id',
            component: DetalleSolicitudPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Detalle' },
          },
        ],
      }, {
        path: 'desembolso',
        data: { breadcrumb: 'Desembolso' },
        canActivate: [AuthGuardApp],
        children: [

          {
            path: 'sin-procesar',
            component: DesembolsosPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Sin Procesar' },
          },
          {
            path: 'procesadas',
            component: DesembolsosPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Procesados' },
          }
        ],
      },
      {
        path: 'ajustes',
        component: ConfiguracionesPage,
        canActivate: [AuthGuardApp],
        data: { breadcrumb: 'Configuraciones de la cuenta' },
      },
      {
        path: 'admin',
        data: { breadcrumb: 'Administración' },
        children: [
          {
            path: 'usuarios',
            component: UsuariosPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Usuarios' },
          },
          {
            path: 'usuarios/crear',
            component: ConfiguracionesPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: ['Usuarios', 'Crear usuario'] },
          },
          {
            path: 'usuarios/editar/:id',
            component: ConfiguracionesPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: ['Usuarios', 'Editar usuario'] },
          },
          {
            path: 'roles-permisos',
            component: AccesosPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Roles y permisos' },

          },
          {
            path: 'roles-permisos/editar/:id',
            component: AccesosEditPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Editar rol' }
          },
          {
            path: 'roles-permisos/nuevo',
            component: AccesosEditPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Nuevo rol' },
          }
          ,
          {
            path: 'proveedores',
            component: ProveedoresPage,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: 'Proveedores' },
          },
          {
            path: 'proveedores/crear',
            component: EditarProveedores,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: ['Proveedores', 'Crear proveedor'] },
          },
          {
            path: 'proveedores/editar/:id',
            component: EditarProveedores,
            canActivate: [AuthGuardApp],
            data: { breadcrumb: ['Usuarios', 'Editar proveedor'] },
          }
        ],
      },
    ],
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [PublicGuard],
    //data: { breadcrumb: 'Login' }
  },
  {
    path: 'solicitar-pronto-pago',
    component: SolicitudProntoPagoPage,
  },
  {
    path: 'no-autorizado',
    component: UnAuthorizedPage,
  },
  { path: 'no-autorizado', component: UnAuthorizedPage },
];
