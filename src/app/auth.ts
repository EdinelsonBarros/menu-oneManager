import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { switchMap, catchError, Observable, of, tap } from 'rxjs';
import type { User } from './User';

interface CsrfToken {
  headerName: string;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly api = 'http://localhost:9000';

  private readonly _usuario = signal<User | null>(null);
  private readonly _carregando = signal(true);

  /** Estado somente leitura para os componentes */
  readonly usuario = this._usuario.asReadonly();
  readonly carregando = this._carregando.asReadonly();
  readonly autenticado = computed(() => this._usuario() !== null);

  /** Consulta o backend para saber se há sessão válida. */
  verificarSessao(): Observable<User | null> {
  if (!this.isBrowser) return of(null);

  this._carregando.set(true);

  return this.http.get<User>(`${this.api}/bff/me`, {
    withCredentials: true
  }).pipe(
    tap(dados => {
      this._usuario.set(dados.authenticated ? dados : null);
      this._carregando.set(false);
    }),
    catchError((erro: HttpErrorResponse) => {
      this._usuario.set(null);
      this._carregando.set(false);

      if (erro.status === 401) this.login();

      return of(null);
    })
  );
}
  /** Inicia o fluxo OAuth no backend (BFF). */
  login(): void {
    window.location.href = `${this.api}/bff/login`;
  }

  /** Busca o token CSRF, encerra a sessão no backend e vai para a tela de login. */
  logout(): void {
    this.http.get<CsrfToken>(`${this.api}/bff/csrf`, { withCredentials: true }).pipe(
      switchMap((csrf) =>
        this.http.post(`${this.api}/bff/logout`, null, {
          withCredentials: true,
          headers: { [csrf.headerName]: csrf.token }
        })
      )
    ).subscribe({
      next: () => this.finalizarLogout(),
      error: () => this.finalizarLogout()   // sessão já expirada também leva ao login
    });
  }

  private finalizarLogout(): void {
    this._usuario.set(null);
    window.location.href = `${this.api}/login`;
  }
}