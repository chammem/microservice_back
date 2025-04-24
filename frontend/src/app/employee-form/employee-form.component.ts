import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/EmployeeService';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  submitted = false;
  error: string | null = null;
  isEditMode = false;
  employeeId: number | null = null;

  positions = ['Manager', 'Chef', 'Serveur', 'Barman', 'Autre'];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      poste: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      dateEmbauche: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we're editing an existing employee
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.employeeId = +id;
      this.loading = true;

      this.employeeService
        .getEmployeeById(this.employeeId)
        .pipe(
          catchError((error) => {
            console.error('Error fetching employee:', error);
            this.error = "Impossible de charger les détails de l'employé.";
            this.loading = false;
            return of(null);
          })
        )
        .subscribe((employee) => {
          if (employee) {
            // Format date to YYYY-MM-DD for the input field
            const dateEmbauche = new Date(employee.dateEmbauche).toISOString().split('T')[0];

            this.employeeForm.patchValue({
              ...employee,
              dateEmbauche
            });
          }
          this.loading = false;
        });
    }
  }

  get f() {
    return this.employeeForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = null;

    // Stop if form is invalid
    if (this.employeeForm.invalid) {
      return;
    }

    this.loading = true;
    const employeeData: Employee = this.employeeForm.value;

    // If editing, include the ID
    if (this.isEditMode && this.employeeId) {
      employeeData.id = this.employeeId;
    }

    this.employeeService
      .createEmployee(employeeData)
      .pipe(
        catchError((error) => {
          console.error('Error saving employee:', error);
          this.error = "Erreur lors de la sauvegarde de l'employé. Veuillez réessayer.";
          this.loading = false;
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          // Navigate back to employee list
          this.router.navigate(['/employee']);
        }
        this.loading = false;
      });
  }
}
