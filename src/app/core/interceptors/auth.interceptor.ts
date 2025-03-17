import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../auth/services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private snackBar: MatSnackBar) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    // Clone request to add the authorization header if token exists
    const modifiedReq = token
      ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
      : req;

    // Handle request and errors
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
