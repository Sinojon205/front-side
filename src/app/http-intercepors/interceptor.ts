import {Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "../service/auth.service";

@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let resReq = req;
    if (!req.url.includes('login')) {
      const token = 'Bearer ' + (req.url.includes('refresh') ? this.authService.refresh_token : this.authService.access_token);
      resReq = req.clone({headers: req.headers.set('Authorization', token)});
    }
    return next.handle(resReq);
  }


}
