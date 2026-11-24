import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MenuSystem {
  systemCode: string;
  systemName: string;
  category: string;
  url: string;
  iconPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:9000/bff/me/systems';

  getSystems(): Observable<MenuSystem[]> {
    return this.http.get<MenuSystem[]>(this.apiUrl, {
      withCredentials: true
    });
  }
}