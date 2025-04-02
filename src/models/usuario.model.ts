
export interface Usuario {
    email:       string;
    id:          number;
    name:        string;
    permissions: Permission[];
    role:        string;
    nombres?:    string;
    apellidos?:  string;
    activo?:     boolean;
    cargo?:      string;
    id_role?:     string;
  }
  export interface Permission {
    create_perm: number;
    delete_perm: number;
    edit_perm:   number;
    menu:        Menu;
    view_perm:   number;
}
export interface Menu {
    icon:  string;
    id:    number;
    menu:  string;
    descripcion: string;
    orden: number;
    padre: number;
    path:  string;
}

export interface UsuarioOne {
  activo?:     boolean;
  apellidos?:  string;
  cargo?:      string;
  created_at?: string;
  email?:      string;
  id?:         number;
  id_rol?:     number;
  nombres?:    string;
  reg_activo?: boolean;
  updated_at?: string;
  mensaje?: string;
}

export interface PermissionNode extends Permission {
    children: PermissionNode[];
}
