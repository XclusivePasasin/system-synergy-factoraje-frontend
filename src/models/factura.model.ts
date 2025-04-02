import { Proveedor } from './proveedor.model';
import { Estados } from './enums/global.enum';
export interface Factura {
    descuento_app?:       number;
    cliente?:            string;
    dias_restantes?:     number;
    estado?:              number;
    fecha_otorga?:       string;
    fecha_vence?:        string;
    id?:                 number;
    iva?:                number;
    monto?:              number;
    no_factura?:         string;
    pronto_pago?:        number;
    nombre_proveedor?:   string;
    subtotal_descuento?: number;
    total_a_recibir?:    number;
    subtotal?:           number;
    total?:              number;
    proveedor?:          Proveedor;
}
