import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpProvider } from '../providers/http.provider';
import { LocalStorageProvider } from '../providers/local-storage.provider';
import { AuthGuardApp } from '../guards/auth.guard';
import { PublicGuard } from '../guards/public.guard';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SidebarProvider } from '../providers/sidebar.provider';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Add this if needed
  imports: [
    CommonModule,
    HttpClientModule, 
    RouterOutlet, 
    SidebarComponent, 
    NavbarComponent,
    ToastModule
  ],
  providers: [
    HttpProvider,
    LocalStorageProvider, 
    AuthGuardApp, 
    PublicGuard,
    MessageService,
    SidebarProvider
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {


}
