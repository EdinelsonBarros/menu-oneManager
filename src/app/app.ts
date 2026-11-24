import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from './auth';
import { MenuService, MenuSystem } from './core/menu'
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'menu-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly auth = inject(Auth);

  protected readonly usuario = this.auth.usuario;
  protected readonly carregando = this.auth.carregando;

  protected readonly expandido = signal(false);

  systems: MenuSystem[] = [];
  loading = true;
  error = '';

  private readonly menuService = inject(MenuService);

ngOnInit(): void {
  this.auth.verificarSessao().pipe(
    switchMap(usuario =>
      usuario?.authenticated
        ? this.menuService.getSystems()
        : of([])
    )
  ).subscribe({
    next: systems => {
      this.systems = systems;
      this.loading = false;
    },
    error: err => {
      console.error('Erro ao carregar os sistemas do menu', err);
      this.error = 'Não foi possível carregar os sistemas.';
      this.loading = false;
    }
  });
}
  expandir() { this.expandido.set(true); }
  recolher() { this.expandido.set(false); }
  sair()     { this.auth.logout(); }
}