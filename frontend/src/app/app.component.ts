import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, ToastComponent],
  template: `
    <div class="app-container">
      <header class="app-header">
        <h1 class="header-title">Gestor de Productos</h1>
        <nav class="header-nav">
          <a routerLink="/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact: false}">
            Lista de Productos
          </a>
          <a routerLink="/products/new" routerLinkActive="active">
            Nuevo Producto
          </a>
        </nav>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
      <div class="toast-container">
        <app-toast
          *ngFor="let toast of toasts"
          [visible]="true"
          [message]="toast.message"
          [type]="toast.type"
          [duration]="toast.duration"
          (close)="removeToast(toast.id)">
        </app-toast>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
    }
    .app-header {
      background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
      color: white;
      padding: 1.5rem 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header-title {
      margin: 0 0 1rem 0;
      font-size: 2rem;
      font-weight: 600;
      color: white;
    }
    .header-nav {
      display: flex;
      gap: 1.5rem;
    }
    .header-nav a {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.3s;
      font-size: 1rem;
    }
    .header-nav a:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
    .header-nav a.active {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      font-weight: 500;
    }
    .app-main {
      flex: 1;
      padding: 2rem;
      max-width: 1400px;
      width: 100%;
      margin: 0 auto;
      background: #f5f5f5;
    }
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  `]
})
export class AppComponent implements OnInit {
  toasts: any[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string) {
    this.toastService.remove(id);
  }
}
