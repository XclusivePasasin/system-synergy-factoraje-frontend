import { Component, OnInit } from '@angular/core';
import { HttpProvider } from '../../../providers/http.provider';
import { LocalStorageProvider } from '../../../providers/local-storage.provider';
import { Router } from '@angular/router';
import { SynergyProvider } from '../../../providers/synergy.provider';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { Email, MenuPermisssion } from '../../../utility/global.util';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-home',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
  ],
  providers: [SynergyProvider, LocalStorageProvider],
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  email: string = '';
  password: string = '';
  newPasswordF: string = '';
  newPasswordS: string = '';
  isFormInvalid = false;
  messageError = '';
  changePassword = false;
  currentToken = '';
  currentEmail = '';
  currentUser = '';
  currentUserID: number = 0;
  currentUserRol = '';
  currentUserName = '';
  currentUserLastName = '';
  currentUserEmail = '';
  currentUserIDRol = '';
  currentMenu:any = [];

  passwordVisible: boolean = false;

  constructor(
    private synergyProvider: SynergyProvider,
    private storeProv: LocalStorageProvider,
    private router: Router,
    private messageService: MessageService,
  ) { }

  async login() {
    if (!this.email || !this.password || !this.isValidEmail(this.email)) {
      this.isFormInvalid = true;
      return;
    }

    this.isFormInvalid = false;
    try {
      const resp = await this.synergyProvider.login(this.email, this.password);

      if (resp) {
        console.log(resp.data)
        this.currentToken = resp.data.access_token;
        this.currentEmail = resp.data.usuario.email ?? '';
        this.currentUser = resp.data.usuario.name ?? '';
        this.currentMenu = resp.data.usuario.permissions;
        this.currentUserID = resp.data.usuario.id ?? 0;

        this.currentUserRol = resp.data.usuario.role ?? '';
        this.currentUserName = resp.data.usuario.nombres ?? '';
        this.currentUserLastName = resp.data.usuario.apellidos ?? '';
        this.currentUserEmail = resp.data.usuario.email ?? '';
        this.currentUserIDRol = resp.data.usuario.id_role ?? '';

        if(resp.data.change_password == 1){
          this.messageError = 'Es necesario restablecer tu contraseña, por favor ingresa una nueva.';
          this.changePassword = true;
        }else{
          this.authSuccess('Inicio de sesión','Has iniciado sesión exitosamente.');
        }
      }
    } catch (error: any) {
        this.messageError = error.message;
    }


  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  authSuccess(summary: string, detail: string){
    this.storeProv.jwtSession = this.currentToken; // Guarda el token
    this.storeProv.userNameSession = this.currentUser;
    this.storeProv.userIDSession = this.currentUserID.toString();
    this.storeProv.menuSession = MenuPermisssion.format(this.currentMenu);

    this.storeProv.userRolSession = this.currentUserRol;
    this.storeProv.userNameSession = this.currentUserName;
    this.storeProv.userLastNameSession = this.currentUserLastName;
    this.storeProv.userEmailSession = this.currentUserEmail;
    this.storeProv.userIDRolSession = this.currentUserIDRol;

    this.messageService.add({ severity: 'success', summary: summary, detail: detail });
    this.router.navigate(['/home']); // Redirige al home
  }

  restablecer(){
    if (!this.newPasswordF || !this.newPasswordS || !this.validatePassword()) {
      this.isFormInvalid = true;
      return;
    }
    this.synergyProvider.resetPassword(this.currentEmail,this.newPasswordF,this.currentToken).then(
      (resp)=>{
        this.authSuccess('Restablecer contraseña','Has restablecido tu contraseña exitosamente.');
      },
      (error)=>{
        this.messageError = error.message;
      }
    )
  }

  isValidEmail(email: string): boolean {
    return Email.isValid(email);
  }

  validatePassword(){
    if(this.newPasswordF && this.newPasswordS){
      if(this.newPasswordF != this.newPasswordS){
        this.messageError = 'Las contraseñas no coinciden, por favor verifica.';
        return false;
      }
      if(this.newPasswordF.length < 6 || this.newPasswordS.length < 6){
        this.messageError = 'La contraseña debe tener al menos 6 caracteres.';
        return false;
      }
      this.messageError = '';
      return true;
    }
    return false;
  }
}
