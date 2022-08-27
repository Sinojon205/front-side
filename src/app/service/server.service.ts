import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import {CustomResponse} from "../interface/custom-response";
import {Server} from "../interface/server";
import {Status} from "../enum/status.enum";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  api = 'http://localhost:8080';

  constructor(private http: HttpClient) {
    this.api = environment.api + ':' + environment.port
    console.log(this.api)
  }

  server$ =()=> <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.api}/server/list`).pipe(
    tap(console.log),
    catchError(this.handleError));


  save$ = (server: Server) => <Observable<CustomResponse>>this.http.post(`${this.api}/server/save`, server).pipe(
    tap(console.log),
    catchError(this.handleError));


  ping$ = (ipAddress: string) => <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.api}/server/ping/${ipAddress}`).pipe(
    tap(console.log),
    catchError(this.handleError));

  delete$ = (id: number) => <Observable<CustomResponse>>this.http.delete<CustomResponse>(`${this.api}/server/delete/${id}`).pipe(
    tap(console.log),
    catchError(this.handleError));

  filter$ = (status: string, response: CustomResponse) => <Observable<CustomResponse>>new Observable<CustomResponse>(
    subscriber => {
      console.log(response);
      subscriber.next(status === Status.ALL ? {...response, message: `Servers filtered by ${status} status`} :
        {
          ...response,
          message: response.data.servers
            .filter(server => server.status === status).length > 0 ?
            `Servers filtered by ${status === Status.SERVER_UP ? 'SERVER_UP' :
              'SERVER_DOWN'} status` : `No servers of ${status} found`,
          data: {servers: response.data.servers?.filter(server => server.status === status)}

        });
      subscriber.complete();

    }).pipe(
    tap(console.log),
    catchError(this.handleError));


  private handleError(error: HttpErrorResponse): Observable<any> {
    console.log(error)
    return throwError('An error occurred - Error code:' + error.status);
  }
}
