import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-signin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-signin.component.html',
  styleUrls: ['./auth-signin.component.scss']
})
export class AuthSigninComponent {
  username = 'sinda';
  password = '123456';

  constructor(private auth: AuthService) {}

  login() {
    this.auth.login(this.username, this.password).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.access_token);
        console.log('Login successful', res);
      },
      err => {
        console.error('Login failed', err);
        alert(`Login failed: ${err.error.error_description}`);
      }
    );
  }
}