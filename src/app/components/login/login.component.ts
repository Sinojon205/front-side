import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {catchError, of, Subscription} from "rxjs";
import {cleanSubscription} from "../../utils/subscription-utils";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  logging = false;
  private logSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.logSub = cleanSubscription(this.logSub);
  }

  login(loginForm: any) {
    this.logging = true;
    this.logSub = this.authService.login(loginForm.value).pipe(catchError((error: string) => {
        console.log(error);
        return of(false)
      })
    ).subscribe((res) => {
      if (res) {
        this.router.navigate(['/server']);
      }
      console.log(res)
      this.logging = false;
    })
  }
}
