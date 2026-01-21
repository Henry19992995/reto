import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancel()" *ngIf="visible">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-body">
          <p class="modal-message">{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-cancel" (click)="onCancel()">
            Cancelar
          </button>
          <button type="button" class="btn btn-confirm" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s;
    }
    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    .modal-body {
      padding: 0;
      margin-bottom: 2rem;
    }
    .modal-message {
      margin: 0;
      color: #333;
      line-height: 1.6;
      text-align: center;
      font-size: 1rem;
    }
    .modal-footer {
      padding: 0;
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s;
      flex: 1;
    }
    .btn-cancel {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-cancel:hover {
      background: #ffe866;
    }
    .btn-confirm {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-confirm:hover {
      background: #ffe866;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() visible = false;
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro?';
  @Input() confirmText = 'Confirmar';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
    this.visible = false;
  }

  onCancel() {
    this.cancel.emit();
    this.visible = false;
  }
}
