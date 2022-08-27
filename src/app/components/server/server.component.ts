import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, startWith} from "rxjs";
import {AppState} from "../../interface/app-state";
import {CustomResponse} from "../../interface/custom-response";
import {ServerService} from "../../service/server.service";
import {AuthService} from "../../service/auth.service";
import {DataState} from "../../enum/data-state.enum";
import {Status} from 'src/app/enum/status.enum';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  @ViewChild('table', {static: false}) tableRef: ElementRef;
  appState$: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  readonly Status = Status;
  addModalShowing = false
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();

  constructor(private service: ServerService, private authService: AuthService) {
  }

  ngOnInit() {
    this.appState$ = this.service.server$().pipe(
      map(response => {
        this.dataSubject.next(response);
        return {dataState: DataState.LOADED_STATE, appData: response}
      }),
      startWith({dataState: DataState.LOADING_STATE}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR_STATE, error})
      }));
  }

  pingServer(ipAddress: string) {
    this.filterSubject.next(ipAddress);
    this.appState$ = this.service.ping$(ipAddress)
      .pipe(
        map(response => {
          this.dataSubject.value.data.servers[
            this.dataSubject.value.data.servers.findIndex(it => it.id === response.data.server.id)
            ] = response.data.server
          this.filterSubject.next('');
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.filterSubject.next('');
          return of({dataState: DataState.ERROR_STATE, error})
        })
      );

  }

  filterServers(status: string) {
    this.appState$ = this.service.filter$(status, this.dataSubject.value)
      .pipe(
        map(response => {
          return {dataState: DataState.LOADED_STATE, appData: response}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  addServer() {
    this.addModalShowing = true;
  }

  onAddAction(evt: string | any) {
    if (typeof evt === 'string') {
      this.addModalShowing = false;
      return
    }
    this.appState$ = this.service.save$(evt)
      .pipe(
        map(response => {
          this.addModalShowing = false;
          this.dataSubject.value.data.servers.unshift(response.data.server)
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          this.addModalShowing = false;
          return of({dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  deleteServer(id: number) {
    this.appState$ = this.service.delete$(id)
      .pipe(
        map(response => {
          this.dataSubject.value.data.servers = this.dataSubject.value.data.servers.filter(it => it.id !== id);
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}),
        catchError((error: string) => {
          return of({dataState: DataState.ERROR_STATE, error})
        })
      );
  }

  printData() {
    if (this.tableRef && this.tableRef.nativeElement) {
      const data = this.tableRef.nativeElement.outerHTML;
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.href = 'data:application/vnd.ms-excel.sheet.macroEnabled.12, ' + data.replace(/ /g, '%20');
      a.download = 'server-report.xls';
      a.click();
      document.body.removeChild(a);
    }
  }

  getImageUrl(imgUrl: any) {
    return this.service.api + '/images/' + imgUrl;
  }
}
