import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast" [class]="'toast-' + type" *ngIf="visible">
      <div class="toast-content">
        <span class="toast-icon">{{ getIcon() }}</span>
        <span class="toast-message">{{ message }}</span>
      </div>
      <button class="toast-close" (click)="close()">×</button>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 20px;
      right: 20px;
      background: white;
      border-radius: 8px;
      padding: 1rem 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 300px;
      max-width: 500px;
      z-index: 2000;
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .toast-success {
      border-left: 4px solid #28a745;
    }
    .toast-error {
      border-left: 4px solid #dc3545;
    }
    .toast-info {
      border-left: 4px solid #17a2b8;
    }
    .toast-warning {
      border-left: 4px solid #ffc107;
    }
    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }
    .toast-icon {
      font-size: 1.5rem;
      line-height: 1;
    }
    .toast-success .toast-icon {
      color: #28a745;
    }
    .toast-error .toast-icon {
      color: #dc3545;
    }
    .toast-info .toast-icon {
      color: #17a2b8;
    }
    .toast-warning .toast-icon {
      color: #ffc107;
    }
    .toast-message {
      color: #333;
      font-size: 0.95rem;
      line-height: 1.4;
    }
    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #999;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transition: color 0.2s;
    }
    .toast-close:hover {
      color: #333;
    }
  `]
})
export class ToastComponent {
  @Input() visible = false;
  @Input() message = '';
  @Input() type: ToastType = 'info';
  @Input() duration = 3000;

  getIcon(): string {
    switch (this.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return 'ℹ';
    }
  }

  close() {
    this.visible = false;
  }
}
