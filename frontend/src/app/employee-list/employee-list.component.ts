import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Employee } from '../models/Employee';
import { Shift } from '../models/Shift';
import { EmployeeService } from '../services/EmployeeService';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EmployeeListComponent implements OnInit {
  // Main data properties
  employees: Employee[] = [];
  displayedEmployees: Employee[] = [];
  employeeShifts: Shift[] = [];

  // UI state properties
  loading = true;
  loadingShifts = false;
  error: string | null = null;
  selectedEmployeeName = '';
  selectedEmployeeId: number | null = null;

  // Search and pagination properties
  searchTerm = '';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 0;
  pages: number[] = [];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  openModal(): void {
    const modal = document.getElementById('employeeShiftsModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
      document.body.classList.add('modal-open');

      // Add backdrop
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    }
  }

  closeModal(): void {
    const modal = document.getElementById('employeeShiftsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');

      // Remove backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.parentNode?.removeChild(backdrop);
      }
    }
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = null;

    this.employeeService
      .getAllEmployees()
      .pipe(
        catchError((err) => {
          console.error('Error fetching employees:', err);
          this.error = 'Failed to load employees. Please try again.';
          this.loading = false;
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          // Fix for the double array issue - check if data is an array within an array
          this.employees = Array.isArray(data[0]) ? data[0] : data;
          this.totalItems = this.employees.length;
          this.calculateTotalPages();
          this.applyFilter();
          this.loading = false;
          console.log('Employees loaded:', this.employees);
        }
      });
  }

  viewShifts(employeeId: number): void {
    this.loadingShifts = true;
    this.selectedEmployeeId = employeeId;
    this.error = null;

    // Find the employee name for display in the modal header
    const employee = this.employees.find((emp) => emp.id === employeeId);
    this.selectedEmployeeName = employee ? employee.nom || employee.email || `ID: ${employeeId}` : `ID: ${employeeId}`;

    console.log(`[EMPLOYEE] Fetching shifts for employee: ${this.selectedEmployeeName} (ID: ${employeeId})`);

    // Use the existing service method to fetch shifts
    this.employeeService
      .getShiftsOfEmployee(employeeId)
      .pipe(
        catchError((err) => {
          console.error('Error fetching shifts:', err);
          this.error = 'Failed to load shifts. Please try again.';
          this.loadingShifts = false;
          return of([]);
        })
      )
      .subscribe({
        next: (shifts) => {
          console.log(`[EMPLOYEE] Received ${shifts.length} shifts:`, shifts);
          this.employeeShifts = shifts;
          this.loadingShifts = false;
          this.openModal(); // Use our custom method to show modal
        }
      });
  }

  // Helper method for duration calculation
  getDuration(startTime: string, endTime: string): string {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);

      const durationMs = end.getTime() - start.getTime();
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      return `${hours}h ${minutes}min`;
    } catch (error) {
      return 'N/A';
    }
  }

  // Position badge styling based on role
  getPositionBadgeClass(position: string | null): string {
    if (!position) return 'bg-secondary';

    switch (position.toLowerCase()) {
      case 'manager':
        return 'bg-primary';
      case 'chef':
        return 'bg-danger';
      case 'serveur':
        return 'bg-success';
      case 'barman':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  // Pagination methods
  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    const filteredEmployees = this.getFilteredEmployees();
    this.displayedEmployees = filteredEmployees.slice(startIndex, startIndex + this.pageSize);
  }

  onPageSizeChange(): void {
    this.calculateTotalPages();
    this.setPage(1);
  }

  // Search and filter methods
  applyFilter(): void {
    const filteredEmployees = this.getFilteredEmployees();
    this.totalItems = filteredEmployees.length;
    this.calculateTotalPages();
    this.setPage(1);
  }

  getFilteredEmployees(): Employee[] {
    if (!this.searchTerm?.trim()) {
      return this.employees;
    }

    const term = this.searchTerm.toLowerCase().trim();
    return this.employees.filter(
      (emp) =>
        emp.nom?.toLowerCase()?.includes(term) ||
        false ||
        emp.email?.toLowerCase()?.includes(term) ||
        false ||
        emp.telephone?.includes(term) ||
        false ||
        emp.poste?.toLowerCase()?.includes(term) ||
        false
    );
  }

  // Deletion method - adjust as needed for your actual API
  deleteEmployee(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      // Replace with actual API call when you implement delete
      this.employees = this.employees.filter((emp) => emp.id !== id);
      this.applyFilter();
    }
  }
}
