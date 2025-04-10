import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-menu',
  template: `
    <ion-menu contentId="main-content" type="overlay">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Menu</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="menu-container">
          <div class="user-profile">
            <div class="avatar">
              <ion-icon name="person-circle-outline"></ion-icon>
            </div>
            <div class="user-info">
              <h2>{{ userName }}</h2>
              <p>Jogador</p>
            </div>
          </div>
          
          <ion-list lines="none">
            <ion-menu-toggle autoHide="false">
              <ion-item button routerLink="/home" routerDirection="root" class="menu-item">
                <ion-icon slot="start" name="home-outline"></ion-icon>
                <ion-label>Início</ion-label>
              </ion-item>

              <ion-item button routerLink="/credit-cards" routerDirection="root" class="menu-item">
                <ion-icon slot="start" name="card-outline"></ion-icon>
                <ion-label>Cartões</ion-label>
              </ion-item>

              <ion-item button routerLink="/profile" routerDirection="root" class="menu-item">
                <ion-icon slot="start" name="person-outline"></ion-icon>
                <ion-label>Perfil</ion-label>
              </ion-item>

              <ion-item button (click)="logout()" class="menu-item logout">
                <ion-icon slot="start" name="log-out-outline"></ion-icon>
                <ion-label>Sair</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
          
          <div class="menu-footer">
            <p>Urubu Jogos &copy; 2025</p>
          </div>
        </div>
      </ion-content>
    </ion-menu>
  `,
  styles: [`
    ion-menu {
      --width: 280px;
      --background: var(--ion-background-color);
    }
    
    ion-toolbar {
      --background: linear-gradient(135deg, #D4AF37, #F9D423);
      --color: #000000;
    }
    
    .menu-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      padding: 20px 16px;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(249, 212, 35, 0.1));
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #D4AF37, #F9D423);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 16px;
    }
    
    .avatar ion-icon {
      font-size: 30px;
      color: #000000;
    }
    
    .user-info h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
      color: var(--ion-text-color);
    }
    
    .user-info p {
      font-size: 14px;
      margin: 4px 0 0;
      color: var(--ion-color-medium);
    }
    
    ion-list {
      padding: 0;
      background: transparent;
    }
    
    .menu-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 50px;
      --background: transparent;
      --background-hover: rgba(212, 175, 55, 0.1);
      --background-activated: rgba(212, 175, 55, 0.2);
      --border-color: transparent;
      margin: 4px 0;
      border-radius: 8px;
      margin-left: 8px;
      margin-right: 8px;
    }
    
    .menu-item ion-icon {
      color: #D4AF37;
      margin-right: 10px;
    }
    
    .menu-item.logout {
      margin-top: 20px;
    }
    
    .menu-item.logout ion-icon {
      color: var(--ion-color-danger);
    }
    
    .menu-footer {
      margin-top: auto;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: var(--ion-color-medium);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
  `]
})
export class SideMenuComponent {
  userName: string = 'Usuário';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Get user name from auth service if available
    const user = this.authService.getCurrentUser();
    if (user && user.nome) {
      this.userName = user.nome;
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
} 