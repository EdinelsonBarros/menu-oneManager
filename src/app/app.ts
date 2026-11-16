import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'menu-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected expandido = signal(false);

  expandir() { this.expandido.set(true); }
  recolher() { this.expandido.set(false); }
}
