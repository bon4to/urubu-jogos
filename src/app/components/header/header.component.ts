import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <div class="header-logo-box" (click)="voltarHome()">
          <img src="../../assets/images/logo-typo-unspaced.png" alt="Logo Urubu Jogos" />
        </div>
      </ion-toolbar>
    </ion-header>
  `,
  styles: [`
    .header-logo-box {
      display: flex;
      align-items: center;
      justify-content: start;
      cursor: pointer;
      height: 100%;
    }
    .header-logo-box img {
      height: 30px;
      width: auto;
    }
    ion-toolbar {
      --min-height: 56px;
    }
  `]
})
export class HeaderComponent {
  @Input() showLogout = true;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  voltarHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 