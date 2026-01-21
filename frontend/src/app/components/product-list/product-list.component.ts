import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmModalComponent],
  template: `
    <div class="product-list-container">
      <div class="section-header">
        <h2>Lista de Productos</h2>
        <button class="btn btn-primary" routerLink="/products/new">
          + Agregar Producto
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        Cargando productos...
      </div>

      <div *ngIf="error" class="error">
        {{ error }}
      </div>

      <div *ngIf="!loading && !error && filteredProducts.length === 0" class="empty-state">
        <p>No hay productos registrados</p>
        <button class="btn btn-primary" routerLink="/products/new">
          Crear Primer Producto
        </button>
      </div>

      <div *ngIf="!loading && !error && filteredProducts.length > 0" class="content-card">
        <div class="header-actions">
          <input 
            type="text" 
            class="search-input" 
            placeholder="Search..." 
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()">
          <button class="btn btn-add" routerLink="/products/new">
            Agregar
          </button>
        </div>

        <div *ngIf="!loading && !error && filteredProducts.length > 0" class="table-container">
          <table class="products-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Nombre del producto</th>
                <th>
                  Descripción
                  <span class="info-icon" title="Descripción del producto">i</span>
                </th>
                <th>
                  Fecha de liberación
                  <span class="info-icon" title="Fecha de liberación">i</span>
                </th>
                <th>
                  Fecha de reestructuración
                  <span class="info-icon" title="Fecha de reestructuración">i</span>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of paginatedProducts">
                <td>
                  <div class="logo-circle">
                    <img *ngIf="product.logo" [src]="product.logo" [alt]="product.name" onerror="this.style.display='none'">
                    <span *ngIf="!product.logo || !product.logo.includes('http')" class="logo-initials">
                      {{ getInitials(product.name) }}
                    </span>
                  </div>
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ formatDate(product.date_release) }}</td>
                <td>{{ formatDate(product.date_revision) }}</td>
                <td>
                  <div class="menu-container">
                    <button class="menu-button" (click)="toggleMenu(product.id)">
                      <span>⋮</span>
                    </button>
                    <div class="menu-dropdown" *ngIf="openMenuId === product.id">
                      <button (click)="editProduct(product.id)">Editar</button>
                      <button (click)="deleteProduct(product.id, product.name)">Eliminar</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="table-footer">
            <span class="results-count">{{ filteredProducts.length }} Resultados</span>
            <div class="pagination-control">
              <select [(ngModel)]="itemsPerPage" (change)="onItemsPerPageChange()">
                <option [value]="5">5</option>
                <option [value]="10">10</option>
                <option [value]="20">20</option>
                <option [value]="50">50</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <app-confirm-modal
        [visible]="showDeleteModal"
        title="Eliminar Producto"
        [message]="deleteModalMessage"
        confirmText="Confirmar"
        (confirm)="confirmDelete()"
        (cancel)="cancelDelete()">
      </app-confirm-modal>
    </div>
  `,
  styles: [`
    .product-list-container {
      width: 100%;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .section-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
    }
    .content-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
    }
    .search-input {
      flex: 1;
      max-width: 300px;
      padding: 0.75rem 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.3s;
    }
    .search-input:focus {
      border-color: #6c757d;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s;
      text-decoration: none;
      display: inline-block;
      color: white;
    }
    .btn-primary {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-primary:hover {
      background: #ffe866;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 240, 133, 0.4);
    }
    .btn-add {
      background: #fff085;
      color: #1a1a1a;
    }
    .btn-add:hover {
      background: #ffe866;
    }
    .loading, .error {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
    }
    .error {
      color: #dc3545;
      background: #f8d7da;
      border-radius: 6px;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .empty-state p {
      margin: 0 0 1.5rem 0;
      color: #666;
      font-size: 1.1rem;
    }
    .table-container {
      overflow-x: auto;
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    .products-table thead {
      background: #f8f9fa;
    }
    .products-table th {
      padding: 1rem;
      text-align: left;
      font-weight: 500;
      color: #555;
      font-size: 0.9rem;
      border-bottom: 2px solid #e0e0e0;
    }
    .products-table td {
      padding: 1rem;
      border-bottom: 1px solid #f0f0f0;
      color: #555;
    }
    .products-table tbody tr:hover {
      background: #f8f9fa;
    }
    .info-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #e0e0e0;
      color: #666;
      font-size: 0.75rem;
      font-weight: bold;
      margin-left: 0.5rem;
      cursor: help;
    }
    .logo-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .logo-circle img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .logo-initials {
      font-size: 0.875rem;
      font-weight: 600;
      color: #555;
    }
    .menu-container {
      position: relative;
    }
    .menu-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
      font-size: 1.2rem;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .menu-button:hover {
      color: #333;
    }
    .menu-dropdown {
      position: absolute;
      right: 0;
      top: 100%;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      z-index: 10;
      min-width: 120px;
      margin-top: 0.25rem;
    }
    .menu-dropdown button {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
      color: #555;
      transition: background 0.2s;
    }
    .menu-dropdown button:hover {
      background: #f8f9fa;
    }
    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      margin-top: 1rem;
      border-top: 1px solid #e0e0e0;
    }
    .results-count {
      color: #555;
      font-size: 0.9rem;
    }
    .pagination-control select {
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      background: white;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.5rem center;
      padding-right: 2rem;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  showDeleteModal = false;
  productToDelete: { id: string; name: string } | null = null;
  deleteModalMessage = '';
  searchTerm = '';
  itemsPerPage = 5;
  currentPage = 1;
  openMenuId: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadProducts();
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.menu-container')) {
        this.openMenuId = null;
      }
    });
  }

  loadProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getAllProducts().subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los productos. Asegúrate de que el backend esté ejecutándose.';
        this.loading = false;
        console.error('Error loading products:', err);
      }
    });
  }

  onSearchChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      if (!this.searchTerm) return true;
      const search = this.searchTerm.toLowerCase();
      return product.name.toLowerCase().includes(search) ||
             product.description.toLowerCase().includes(search) ||
             product.id.toLowerCase().includes(search);
    });
    this.updatePagination();
  }

  onItemsPerPageChange() {
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  toggleMenu(productId: string) {
    this.openMenuId = this.openMenuId === productId ? null : productId;
  }

  editProduct(id: string) {
    this.openMenuId = null;
    this.router.navigate(['/products/edit', id]);
  }

  deleteProduct(id: string, name: string) {
    this.openMenuId = null;
    this.productToDelete = { id, name };
    this.deleteModalMessage = `¿Estas seguro de eliminar el producto ${name}?`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.toastService.success('Producto eliminado exitosamente');
          this.loadProducts();
          this.showDeleteModal = false;
          this.productToDelete = null;
        },
        error: (err) => {
          this.toastService.error('Error al eliminar el producto');
          console.error('Error deleting product:', err);
          this.showDeleteModal = false;
          this.productToDelete = null;
        }
      });
    }
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  getInitials(name: string): string {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}
