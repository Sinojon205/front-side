import {Injectable} from '@angular/core';
import {catchError, map, Observable, of, throwError} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import jwtDecode from "jwt-decode";
import {LoginResult} from "../interface/login-result";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false
  redirectUrl: string | null = null;
  api = "http://localhost:8080"
  access_token = '';
  refresh_token = '';

  constructor(private http: HttpClient) {
    this.api = environment.api + ':' + environment.port
    const data = localStorage.getItem('refresh_token');
    if (data) {
      const decode: any = jwtDecode(data)
      if (decode && decode.iss === `${this.api}/users/api/login`) {
        this.refresh_token = data;
      }
    }
  }

  login(data: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    const body = new URLSearchParams();
    body.set('username', data.username);
    body.set('password', data.password);
    console.log(body.toString())
    return this.http.post(this.api + "/users/api/login", body.toString(), {
      responseType: 'json',
      headers
    }).pipe(map((res: LoginResult) => this.handleResult(res)),
      catchError((err) => this.handleError(err)))
  }

  refreshToken(): Observable<any> {
    if (this.refresh_token) {
      return this.http.post(this.api + '/users/token/refresh', null)
        .pipe(map((res: LoginResult) => this.handleResult(res)),
          catchError((err) => this.handleError(err)))
    }
    return of(false)
  }


  logOut(): void {
    this.access_token = '';
    this.loggedIn = false;
  }

  private handleResult(res: LoginResult): boolean {
    this.loggedIn = true;
    this.refresh_token = res.refresh_token;
    this.access_token = res.access_token;
    localStorage.setItem("refresh_token", this.refresh_token);
    return true
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error)
    return throwError('An error occurred - Error code:' + error.status);
  }
}
