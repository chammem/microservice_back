import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Shift } from '../models/Shift';
import { Employee } from '../models/Employee';
import { EmployeeService } from '../services/EmployeeService';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-shift-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shift-list.component.html',
  styleUrls: ['./shift-list.component.scss']
})
export class ShiftListComponent implements OnInit {
  // Calendar data
  weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
  shiftTypes = ['Matin', 'Soir'];
  
  // All shifts from API
  shifts: Shift[] = [];
  
  // Organized shifts by day and type for display
  calendarShifts: { [day: string]: { [type: string]: Shift | null } } = {};
  
  // Modal properties
  currentShift: Shift | null = null;
  showShiftModal = false;
  showEmployeeModal = false;
  
  // Form data
  newShiftName = '';
  newShiftDescription = '';
  newShiftDate = new Date().toISOString().split('T')[0];
  startTime = '08:00';
  endTime = '16:00';
  
  // Employee assignment
  allEmployees: Employee[] = [];
  assignedEmployees: Employee[] = [];
  availableEmployees: Employee[] = [];
  selectedEmployeeId: number | null = null;
  
  // State management
  loading = false;
  error: string | null = null;
  
  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.initializeCalendar();
    this.loadShifts();
  }

  initializeCalendar(): void {
    // Create empty shift slots for each day and shift type
    this.weekDays.forEach(day => {
      this.calendarShifts[day] = {};
      this.shiftTypes.forEach(type => {
        this.calendarShifts[day][type] = null;
      });
    });
  }

  loadShifts(): void {
    this.loading = true;
    
    this.employeeService.getAllShifts().pipe(
      catchError(err => {
        console.error('Error loading shifts', err);
        this.error = 'Failed to load shifts';
        this.loading = false;
        return of([]);
      })
    ).subscribe(shifts => {
      this.shifts = shifts;
      this.organizeShiftsInCalendar();
      this.loading = false;
    });
  }

  organizeShiftsInCalendar(): void {
    // Reset calendar first
    this.initializeCalendar();
    
    console.log('Organizing shifts:', this.shifts);
    
    // Organize shifts into the calendar structure
    this.shifts.forEach(shift => {
      try {
        // Parse the date
        const dateStr = shift.date;
        const date = new Date(dateStr);
        
        // Get day of week (0 = Sunday, 1 = Monday, etc.)
        const dayIndex = date.getDay();
        
        // Convert to our day names (where Monday is first)
        const day = this.weekDays[(dayIndex + 6) % 7]; // Adjust for Monday as first day
        
        // Determine if morning or evening shift based on start time
        let startHour;
        
        if (shift.startTime.includes('T')) {
          // Full datetime format
          startHour = new Date(shift.startTime).getHours();
        } else {
          // Simple time string format "08:00:00"
          startHour = parseInt(shift.startTime.split(':')[0], 10);
        }
        
        // Use noon (12) as the cutoff between morning and evening
        const type = startHour < 12 ? 'Matin' : 'Soir';
        
        console.log(`Shift ${shift.id}: date=${dateStr}, day=${day}, startHour=${startHour}, type=${type}`);
        
        // Assign shift to the correct day and type
        this.calendarShifts[day][type] = shift;
      } catch (err) {
        console.error('Error organizing shift in calendar:', err, shift);
      }
    });
  }

  openShiftModal(day: string, type: string): void {
    // Check if we're editing an existing shift or creating a new one
    const existingShift = this.calendarShifts[day][type];
    
    if (existingShift) {
      // Edit mode - Actually for now we can't edit shifts based on available endpoints
      // So we'll just show the details
      this.currentShift = existingShift;
      this.newShiftName = existingShift.name;
      this.newShiftDescription = existingShift.description;
      
      const date = new Date(existingShift.date);
      this.newShiftDate = date.toISOString().split('T')[0];
      
      const startDate = new Date(existingShift.startTime);
      this.startTime = startDate.getHours().toString().padStart(2, '0') + ':' + 
                      startDate.getMinutes().toString().padStart(2, '0');
                      
      const endDate = new Date(existingShift.endTime);
      this.endTime = endDate.getHours().toString().padStart(2, '0') + ':' + 
                    endDate.getMinutes().toString().padStart(2, '0');
    } else {
      // Create mode
      this.currentShift = null;
      this.newShiftName = `${type} - ${day}`;
      this.newShiftDescription = '';
      
      // Calculate date for the selected day
      const today = new Date();
      const currentDayOfWeek = today.getDay(); // 0 is Sunday
      const targetDayOfWeek = this.weekDays.indexOf(day);
      const adjustedTarget = (targetDayOfWeek + 1) % 7; // Convert to 0-based where 0 is Sunday
      
      const daysToAdd = (adjustedTarget - currentDayOfWeek + 7) % 7;
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + daysToAdd);
      this.newShiftDate = targetDate.toISOString().split('T')[0];
      
      // Set default times based on shift type
      if (type === 'Matin') {
        this.startTime = '08:00';
        this.endTime = '12:00';
      } else {
        this.startTime = '12:00';
        this.endTime = '20:00';
      }
    }
    
    this.showShiftModal = true;
  }

  saveShift(): void {
    if (!this.newShiftName) {
      this.error = 'Le nom du créneau est requis';
      return;
    }
    
    this.loading = true;
    
    // Format date and times to match backend format
    // Note that we're not sending the full ISO datetime
    const shiftData: Shift = {
      name: this.newShiftName, // Backend will ignore this
      date: this.newShiftDate,
      startTime: this.startTime + ':00', // Add seconds to match backend format
      endTime: this.endTime + ':00',     // Add seconds to match backend format
      description: this.newShiftDescription,
      archived: false
    };
    
    // Create new shift
    this.employeeService.createShift(shiftData).pipe(
      catchError(err => {
        console.error('Error creating shift', err);
        this.error = 'Failed to create shift';
        this.loading = false;
        return of(null);
      })
    ).subscribe({
      next: () => {
        this.closeShiftModal();
        this.loadShifts(); // Reload shifts to reflect changes
      }
    });
  }

  closeShiftModal(): void {
    this.showShiftModal = false;
    this.error = null;
  }

  openEmployeeModal(shift: Shift): void {
    if (!shift || !shift.id) {
      this.error = "Impossible d'assigner des employés à ce créneau";
      return;
    }
    
    this.currentShift = shift;
    this.loading = true;
    
    // Ensure the shift has an employees array
    if (!this.currentShift.employees) {
      this.currentShift.employees = [];
    }
    
    // Get all employees
    this.employeeService.getAllEmployees().pipe(
      catchError(err => {
        console.error('Error loading employees', err);
        this.error = 'Échec du chargement des employés';
        this.loading = false;
        return of([]);
      })
    ).subscribe(employees => {
      // Fix for double array issue
      this.allEmployees = Array.isArray(employees[0]) ? employees[0] : employees;
      
      // Get assigned employees from the shift itself or from the API
      if (shift.employees && shift.employees.length > 0) {
        // Use existing employees from the shift
        this.assignedEmployees = [...shift.employees];
      } else {
        // Fetch from API
        this.employeeService.getEmployeesOfShift(shift.id!).pipe(
          catchError(err => {
            console.error('Error loading assigned employees', err);
            this.error = 'Échec du chargement des employés assignés';
            this.loading = false;
            return of(new Set<Employee>());
          })
        ).subscribe(assignedSet => {
          this.assignedEmployees = Array.from(assignedSet);
          
          // Update the shift's employees array
          this.currentShift!.employees = this.assignedEmployees;
          this.updateShiftWithEmployees(this.currentShift!);
          
          this.updateAvailableEmployees();
          this.loading = false;
          this.showEmployeeModal = true;
        });
        return;
      }
      
      // If we already had the employees, just update available employees
      this.updateAvailableEmployees();
      this.loading = false;
      this.showEmployeeModal = true;
    });
  }

  updateAvailableEmployees(): void {
    const assignedIds = new Set(this.assignedEmployees.map(e => e.id));
    this.availableEmployees = this.allEmployees.filter(e => !assignedIds.has(e.id!));
  }

  closeEmployeeModal(): void {
    this.showEmployeeModal = false;
    this.error = null;
  }

  assignEmployee(): void {
    if (!this.selectedEmployeeId || !this.currentShift?.id) {
      this.error = 'Veuillez sélectionner un employé';
      return;
    }
    
    this.loading = true;
    const shiftId = this.currentShift.id;
    
    // Convert selectedEmployeeId to number for comparison
    const employeeId = Number(this.selectedEmployeeId);
    
    // Find the employee we're adding (using numeric comparison)
    const employeeToAdd = this.availableEmployees.find(e => e.id === employeeId);
    if (!employeeToAdd) {
      this.error = 'Employé introuvable';
      this.loading = false;
      return;
    }
    
    // Make the API call with the numeric ID
    this.employeeService.assignEmployeeToShift(shiftId, employeeId).pipe(
      catchError(err => {
        console.error('Error assigning employee', err);
        this.error = 'Échec de l\'assignation de l\'employé';
        this.loading = false;
        return of(null);
      })
    ).subscribe({
      next: (updatedShift) => {
        // Only update local data structures, don't add the employee to shift again
        this.manuallyUpdateEmployeeLists(employeeToAdd);
        
        this.selectedEmployeeId = null;
        this.loading = false;
      }
    });
  }

  manuallyUpdateEmployeeLists(employeeToAdd: Employee): void {
    // Add to assigned employees array
    this.assignedEmployees.push(employeeToAdd);
    
    // Remove from available employees array
    this.availableEmployees = this.availableEmployees.filter(e => e.id !== employeeToAdd.id);
  }

  manuallyUpdateShiftWithNewEmployee(shift: Shift, employee: Employee): void {
    // Initialize employees array if it doesn't exist
    if (!shift.employees) {
      shift.employees = [];
    }
    
    // Add the employee to the shift
    shift.employees.push(employee);
    
    // Update shift in our main arrays
    const index = this.shifts.findIndex(s => s.id === shift.id);
    if (index !== -1) {
      this.shifts[index] = shift;
    }
    
    // Update the shift in the calendar
    this.weekDays.forEach(day => {
      this.shiftTypes.forEach(type => {
        const calendarShift = this.calendarShifts[day][type];
        if (calendarShift && calendarShift.id === shift.id) {
          this.calendarShifts[day][type] = shift;
        }
      });
    });
  }

  updateShiftWithEmployees(updatedShift: Shift): void {
    // Update the shift in our main array
    const index = this.shifts.findIndex(s => s.id === updatedShift.id);
    if (index !== -1) {
      this.shifts[index] = updatedShift;
    }
    
    // Update the current shift reference
    if (this.currentShift?.id === updatedShift.id) {
      this.currentShift = updatedShift;
    }
    
    // Update the shift in the calendar
    this.weekDays.forEach(day => {
      this.shiftTypes.forEach(type => {
        const shift = this.calendarShifts[day][type];
        if (shift && shift.id === updatedShift.id) {
          this.calendarShifts[day][type] = updatedShift;
        }
      });
    });
  }

  // Note: removeEmployeeFromShift functionality removed as endpoint doesn't exist yet

  getShiftTimeForDisplay(shift: Shift): string {
    if (!shift) return '';
    
    try {
      // Handle both time formats: "08:00:00" and full datetime strings
      let startHour, startMin, endHour, endMin;
      
      if (shift.startTime.includes('T')) {
        // Full datetime format (if we created it on frontend)
        const start = new Date(shift.startTime);
        const end = new Date(shift.endTime);
        
        startHour = start.getHours().toString().padStart(2, '0');
        startMin = start.getMinutes().toString().padStart(2, '0');
        endHour = end.getHours().toString().padStart(2, '0');
        endMin = end.getMinutes().toString().padStart(2, '0');
      } else {
        // Simple time string format "08:00:00" from backend
        const startParts = shift.startTime.split(':');
        const endParts = shift.endTime.split(':');
        
        startHour = startParts[0].padStart(2, '0');
        startMin = startParts[1].padStart(2, '0');
        endHour = endParts[0].padStart(2, '0');
        endMin = endParts[1].padStart(2, '0');
      }
      
      return `${startHour}:${startMin} - ${endHour}:${endMin}`;
    } catch (error) {
      console.error('Error formatting shift time', error, shift);
      return 'Invalid time';
    }
  }

  getShiftDisplayName(shift: Shift | null): string {
    if (!shift) return '';
    
    if (shift.name) {
      return shift.name;
    }
    
    // If no name, create a descriptive name based on time
    const timeDisplay = this.getShiftTimeForDisplay(shift);
    return `Créneau ${timeDisplay}`;
  }

  getEmployeeCountText(shift: Shift): string {
    // Return a simple label instead of a count
    return 'Employés';
  }
}