import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <app-side-menu></app-side-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar se o usuário está na rota raiz
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (event.url === '/') {
        // Redirecionar para a página de login apenas se estiver na rota raiz
        this.router.navigate(['/login']);
      }
    });
  }
}
