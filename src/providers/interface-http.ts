import { Solicitud } from './../models/solicitud.model';
import { Factura } from "../models/factura.model";
import { Usuario, UsuarioOne } from '../models/usuario.model';
import { Roles } from '../models/roles.model';
import { Proveedor } from '../models/proveedor.model';

// Obtener detalles de factura
export interface Root10{
    data:{
        factura: Factura
    }
    message: string;
    code: number;
    statuscode?: number;
}

// Solicitud de pronto pago
export interface Root0{
    data:any
    message: string;
    code: number;
    statuscode?: number;
}

// export interface Root11 {
//     code?:    number;
//     data:    DataUSER;
//     message?: string;
// }

//PENDIENTE DE DEFINIR
// Cambiara dado cuando se tenga que obtener los permisos y rol
// export interface DataUSER {
//     email?:           string;
//     nombre_completo: string;
//     token:           string;
//     usuario_id:      number;
// }

// Datos de sesion
export interface Root11 {
  code:    number;
  data:    Data;
  message: string;
}

export interface Data {
  access_token: string;
  change_password: number;
  expires_in:   number;
  usuario:      Usuario;
}

// Obtener solicitudes
export interface Root12 {
  data: {
      current_page: number;
      per_page: number;
      solicitudes: Solicitud;
      total_pages: number;
  };
  message: string;
  code: number;
}

// Obtener Desembolsos
export interface Root21 {
  data: {
      current_page: number;
      per_page: number;
      desembolsos: Solicitud;
      total_pages: number;
  };
  message: string;
  code: number;
}

// Obtener detalle de solicitud
export interface Root13 {
  data: {
      current_page: number;
      per_page: number;
      solicitud: Solicitud;
      total_pages: number;
  };
  message: string;
  code: number;
}

export interface Root14 {
  code:    number;
  data:    {
    email: string;
    mensaje: string;
  };
  message: string;
}

export interface Root15 {
  data: {
    filtros_aplicados: {
      fecha_fin?: Date,
      fecha_inicio?: Date
    };
    solicitudes_aprobadas?:   number;
    solicitudes_sin_aprobar?: number;
    solicitudes_denegadas?:   number;
    total_solicitudes?:       number;
  };
  message: string;
  code: number;
}


export interface Root16{
  data:{
    usuarios: Usuario[];
  }
  message: string;
  code: number;
}

export interface Root20{
  data:{
    proveedores: Proveedor[];
  }
  message: string;
  code: number;
}

export interface Root17u {
  data: UsuarioOne;
  message: string;
  code: number;
}

export interface Root17 {
  code?:    number;
  data?:    DataPermiso;
  message?: string;
}

export interface DataPermiso {
  descripcion?: null;
  id_rol?:      number;
  nombre?:      string;
  permisos?:    Permiso[];
}

export interface Permiso {
  create_perm?: number;
  delete_perm?: number;
  edit_perm?:   number;
  id_menu?:     number;
  view_perm?:   number;
  approve_deny?: number;
  download?:    number;
  process?:     number;
  edit_user?:   number;
  create_user?: number;
  active_inactive_user?: number;
  edit_role?: number;
  create_role?: number;
}

export interface Root18 {
  code?:    number;
  data?:    DataMenu;
  message?: string;
}

export interface DataMenu {
  menus?: Menu[];
}

export interface Menu {
  created_at?:  null;
  description?: Description;
  icon?:        null | string;
  id?:          number;
  menu?:        string;
  orden?:       number | null;
  padre?:       number | null;
  path?:        null | string;
  updated_at?:  null;
}

export enum Description {
  Accion = "ACCION",
  Menu = "MENU",
}


export interface Root19 {
  code?:    number;
  data?:    DataRole;
  message?: string;
}

export interface DataRole {
  roles?: Roles[];
}

export interface Role {
  descripcion?: null;
  id_rol?:      number;
  nombre?:      string;
}
