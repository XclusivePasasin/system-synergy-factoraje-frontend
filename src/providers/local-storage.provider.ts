import { Injectable } from "@angular/core";
import { PermissionNode } from "../models/usuario.model";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageProvider {
    public static JWT_KEY = "JWT0001";
    public static USERNAME_KEY = "USERNAME002";
    public static USERID_KEY = "USERID003";
    public static MENU_KEY = "MENU004";
    public static USER_ROLE = "USERROL005"
    public static USER_NAME = "USERNAME006"
    public static USER_LASTNAME = "USERLASTNAME007"
    public static USER_EMAIL = "USEREMAIL008"
    public static USER_IDROL = "USERIDROL009"
    public static USER_ID = "USERID010"

    constructor() {}

    set jwtSession(token: string) {
        localStorage.setItem(LocalStorageProvider.JWT_KEY, token);
    }

    get jwtSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.JWT_KEY);
    }

    set userNameSession(user: string) {
        localStorage.setItem(LocalStorageProvider.USERNAME_KEY, user);
    }

    get userNameSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USERNAME_KEY);
    }

    set userLastNameSession(user: string) {
        localStorage.setItem(LocalStorageProvider.USER_LASTNAME, user);
    }

    get userLastNameSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USER_LASTNAME);
    }

    set userIDRolSession(user: string) {
      localStorage.setItem(LocalStorageProvider.USER_IDROL, user);
    }

    get userIDRolSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USER_IDROL);
    }

    set userEmailSession(user: string) {
      localStorage.setItem(LocalStorageProvider.USER_EMAIL, user);
    }

    get userEmailSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USER_EMAIL);
    }

    set userRolSession(user: string) {
      localStorage.setItem(LocalStorageProvider.USER_ROLE, user);
    }

    get userRolSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USER_ROLE);
    }

    set userIDSession(id: string) {
        localStorage.setItem(LocalStorageProvider.USERID_KEY, id);
    }

    get userIDSession(): string | null {
        return localStorage.getItem(LocalStorageProvider.USERID_KEY);
    }

    set menuSession(menu: PermissionNode[]) {
        localStorage.setItem(LocalStorageProvider.MENU_KEY, JSON.stringify(menu));
    }

    get menuSession(): PermissionNode[] | null  {
        const menu = localStorage.getItem(LocalStorageProvider.MENU_KEY);
        if(menu){
            return JSON.parse( menu );
        }
        return null;
    }

    clearSession() {
        localStorage.removeItem(LocalStorageProvider.JWT_KEY);
        localStorage.removeItem(LocalStorageProvider.USERNAME_KEY);
        localStorage.removeItem(LocalStorageProvider.USERID_KEY);
        localStorage.removeItem(LocalStorageProvider.USER_ROLE);
        localStorage.removeItem(LocalStorageProvider.MENU_KEY);
        localStorage.removeItem(LocalStorageProvider.USER_LASTNAME);
        localStorage.removeItem(LocalStorageProvider.USER_EMAIL);
        localStorage.removeItem(LocalStorageProvider.USER_IDROL);
    }
}
