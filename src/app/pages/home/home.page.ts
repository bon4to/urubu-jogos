import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  userName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obter o usuário atual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.userName = currentUser.nome;
    }
  }

  abrirJogo(jogo: string) {
    console.log('Abrir jogo:', jogo);
    // Aqui você pode implementar a lógica para abrir o jogo selecionado
  }

  irParaCartoes() {
    this.router.navigate(['/credit-cards']);
  }

  voltarHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
  }
}