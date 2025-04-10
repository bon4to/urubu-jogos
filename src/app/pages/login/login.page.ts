import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  senha = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  async onLogin() {
    if (!this.email || !this.senha) {
      this.showError('Por favor, preencha todos os campos');
      return;
    }

    console.log('Tentando login com:', { email: this.email, senha: '***' });

    this.authService.login(this.email, this.senha).subscribe({
      next: () => {
        console.log('Login bem-sucedido');
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Erro no login:', error);
        this.showError(error.message || 'Email ou senha incorretos');
      }
    });
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}


