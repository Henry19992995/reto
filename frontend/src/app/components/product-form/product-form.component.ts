import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="product-form-container">
      <div class="logo-header">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
            <rect x="6" y="8" width="12" height="8" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        </div>
        <span class="logo-text">BANCO</span>
      </div>
      
      <div class="form-card">
        <h2 class="form-title">Formulario de Registro</h2>
        
        <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="product-form">
          <div class="form-row">
            <div class="form-column">
              <div class="form-group">
                <label for="id">ID</label>
                <input 
                  type="text" 
                  id="id" 
                  formControlName="id"
                  [readonly]="isEditMode"
                  [class.error]="productForm.get('id')?.invalid && productForm.get('id')?.touched"
                  placeholder="">
                <div *ngIf="productForm.get('id')?.invalid && productForm.get('id')?.touched" class="error-message">
                  ID no válido!
                </div>
                <div *ngIf="idExists && !isEditMode" class="error-message">
                  ID no válido!
                </div>
              </div>

              <div class="form-group">
                <label for="description">Descripción</label>
                <textarea 
                  id="description" 
                  formControlName="description"
                  rows="4"
                  [class.error]="productForm.get('description')?.invalid && productForm.get('description')?.touched"
                  placeholder=""></textarea>
                <div *ngIf="productForm.get('description')?.invalid && productForm.get('description')?.touched" class="error-message">
                  Este campo es requerido!
                </div>
              </div>

              <div class="form-group">
                <label for="date_release">Fecha Liberación</label>
                <input 
                  type="date" 
                  id="date_release" 
                  formControlName="date_release"
                  [class.error]="productForm.get('date_release')?.invalid && productForm.get('date_release')?.touched"
                  (change)="onReleaseDateChange()">
                <div *ngIf="productForm.get('date_release')?.invalid && productForm.get('date_release')?.touched" class="error-message">
                  Este campo es requerido!
                </div>
              </div>
            </div>

            <div class="form-column">
              <div class="form-group">
                <label for="name">Nombre</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  [class.error]="productForm.get('name')?.invalid && productForm.get('name')?.touched"
                  placeholder="">
                <div *ngIf="productForm.get('name')?.invalid && productForm.get('name')?.touched" class="error-message">
                  Este campo es requerido!
                </div>
              </div>

              <div class="form-group">
                <label for="logo">Logo</label>
                <input 
                  type="url" 
                  id="logo" 
                  formControlName="logo"
                  [class.error]="productForm.get('logo')?.invalid && productForm.get('logo')?.touched"
                  placeholder="https://ejemplo.com/logo.png">
                <div *ngIf="productForm.get('logo')?.invalid && productForm.get('logo')?.touched" class="error-message">
                  Este campo es requerido!
                </div>
                <div *ngIf="productForm.get('logo')?.value && productForm.get('logo')?.valid" class="logo-preview">
                  <img [src]="productForm.get('logo')?.value" [alt]="'Logo de ' + productForm.get('name')?.value" onerror="this.style.display='none'">
                </div>
              </div>

              <div class="form-group">
                <label for="date_revision">Fecha Revisión</label>
                <input 
                  type="date" 
                  id="date_revision" 
                  formControlName="date_revision"
                  [readonly]="true"
                  [class.disabled]="true">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-reset" (click)="resetForm()">
              Reiniciar
            </button>
            <button 
              type="submit" 
              class="btn btn-submit"
              [disabled]="productForm.invalid || idExists || saving">
              {{ saving ? 'Guardando...' : 'Enviar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .product-form-container {
      max-width: 900px;
      margin: 0 auto;
    }
    .logo-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-text {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: 0.05em;
    }
    .form-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .form-title {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .product-form {
      width: 100%;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .form-column {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
      font-size: 0.9rem;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #000;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
      background: white;
    }
    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #6c757d;
    }
    .form-group input.error,
    .form-group textarea.error {
      border-color: #dc3545;
    }
    .form-group input.disabled,
    .form-group input[readonly] {
      background: #f5f5f5;
      border-color: #e0e0e0;
      color: #999;
      cursor: not-allowed;
    }
    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
    .logo-preview {
      margin-top: 1rem;
      text-align: center;
    }
    .logo-preview img {
      max-width: 150px;
      max-height: 150px;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      object-fit: contain;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
    }
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-reset {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-reset:hover:not(:disabled) {
      background: #ffe866;
    }
    .btn-submit {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-submit:hover:not(:disabled) {
      background: #ffe866;
    }
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  idExists = false;
  saving = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      date_release: ['', Validators.required],
      date_revision: [{value: '', disabled: true}, Validators.required]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = params['id'];
        this.loadProduct(params['id']);
      } else {
        this.productForm.get('id')?.valueChanges.subscribe(id => {
          if (id && !this.isEditMode) {
            this.checkIdExists(id);
          }
        });
      }
    });
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        const releaseDate = new Date(product.date_release);
        const revisionDate = new Date(product.date_revision);
        
        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          date_release: releaseDate.toISOString().split('T')[0],
          date_revision: revisionDate.toISOString().split('T')[0]
        });
        // Mantener deshabilitado en modo edición
        this.productForm.get('date_revision')?.disable();
      },
      error: (err) => {
        this.toastService.error('Error al cargar el producto');
        this.router.navigate(['/products']);
        console.error('Error loading product:', err);
      }
    });
  }

  checkIdExists(id: string) {
    if (!id) {
      this.idExists = false;
      return;
    }
    this.productService.verifyIdentifier(id).subscribe({
      next: (exists) => {
        this.idExists = exists;
      },
      error: () => {
        this.idExists = false;
      }
    });
  }

  onReleaseDateChange() {
    const releaseDate = this.productForm.get('date_release')?.value;
    if (releaseDate) {
      const release = new Date(releaseDate);
      const revision = new Date(release);
      revision.setFullYear(revision.getFullYear() + 1);
      
      this.productForm.patchValue({
        date_revision: revision.toISOString().split('T')[0]
      });
      // Deshabilitar después de calcular
      this.productForm.get('date_revision')?.disable();
    }
  }

  onSubmit() {
    if (this.productForm.invalid || this.idExists) {
      return;
    }

    this.saving = true;
    // Obtener el valor completo del formulario incluyendo campos deshabilitados
    const formValue = this.productForm.getRawValue();
    const product: Product = {
      id: formValue.id,
      name: formValue.name,
      description: formValue.description,
      logo: formValue.logo,
      date_release: formValue.date_release,
      date_revision: formValue.date_revision
    };

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, product).subscribe({
        next: () => {
          this.toastService.success('Producto actualizado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          let errorMsg = 'Error al actualizar el producto';
          if (err.error?.message) {
            errorMsg = err.error.message;
          } else if (err.error?.errors && Array.isArray(err.error.errors)) {
            errorMsg = err.error.errors.map((e: any) => e.constraints ? Object.values(e.constraints).join(', ') : e).join(', ');
          } else if (err.error?.errors && typeof err.error.errors === 'object') {
            const errors = Object.values(err.error.errors).flat();
            errorMsg = errors.join(', ');
          }
          this.toastService.error(errorMsg);
          this.saving = false;
          console.error('Error updating product:', err);
        }
      });
    } else {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.toastService.success('Producto creado exitosamente');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          let errorMsg = 'Error al crear el producto';
          if (err.error?.message) {
            errorMsg = err.error.message;
          } else if (err.error?.errors && Array.isArray(err.error.errors)) {
            errorMsg = err.error.errors.map((e: any) => e.constraints ? Object.values(e.constraints).join(', ') : e).join(', ');
          } else if (err.error?.errors && typeof err.error.errors === 'object') {
            const errors = Object.values(err.error.errors).flat();
            errorMsg = errors.join(', ');
          }
          this.toastService.error(errorMsg);
          this.saving = false;
          console.error('Error creating product:', err);
        }
      });
    }
  }

  resetForm() {
    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    } else {
      this.productForm.reset();
      this.idExists = false;
      this.productForm.get('date_revision')?.disable();
    }
  }
}
