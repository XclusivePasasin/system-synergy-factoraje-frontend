import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalStorageProvider } from '../providers/local-storage.provider';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private storeProv: LocalStorageProvider, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.storeProv.jwtSession;

        if (token) {
            req = req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
            });
        }

        return next.handle(req).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    this.storeProv.clearSession();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }
}
