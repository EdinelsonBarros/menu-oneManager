import { Component, inject, OnInit, signal } from '@angular/core';
import { Auth } from './auth';

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

  ngOnInit(): void {
    this.auth.verificarSessao();
  }

  expandir() { this.expandido.set(true); }
  recolher() { this.expandido.set(false); }
  sair()     { this.auth.logout(); }
}