import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {environment} from "../../environments/environment";
import {NotificationModes, NotificationService} from "./notification.service";

@Injectable()
export class WeatherInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const req = request.clone({params: request.params.set('appid', environment.API_KEY)})
    return next.handle(req).pipe(catchError(error => {
      this.notificationService.showNotification(error.statusText,NotificationModes.Error);
      return throwError(error);
    }));
  }
}
