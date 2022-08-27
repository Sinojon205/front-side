import {Component} from '@angular/core';
import {catchError, interval, mergeMap, of, Subscription} from "rxjs";
import {AuthService} from "./service/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  refreshTokenSub: Subscription;
  minut = 60 * 60 * 1000;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.refreshToken().subscribe((res) => {
      if (res) {
        this.router.navigate(['/server'])
      } else {
        this.router.navigate(['/login'])
      }

    });
    this.refreshTokenSub = interval(30 * this.minut).pipe(
      mergeMap(() => this.authService.refreshToken()),
      catchError((error) => {
        console.log(error);
        this.router.navigate(['/login'])
        return of(false);
      })
    ).subscribe((res) => {
      if (res) {
        //   this.router.navigate(['/server'])
      }
    });
  }
}
