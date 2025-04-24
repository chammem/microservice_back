import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Employee } from '../models/Employee';
import { Shift } from '../models/Shift';
import { KeycloakService } from './keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8093/employee';

  constructor(
    private http: HttpClient,
    private keycloak: KeycloakService
  ) { }

  // Employee endpoints
  getAllEmployees(): Observable<Employee[]> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
  
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });
  
        return this.http.get<Employee[]>(`${this.apiUrl}/find-all`, { headers }).pipe(
          switchMap((employees) => {
            console.log('[EMPLOYEE SERVICE] Employees fetched:', employees);
            return [employees]; // re-wrap as observable
          }),
          catchError(error => this.handleAuthError(error))
        );
      })
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<Employee>(`${this.apiUrl}/find/${id}`, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.post<Employee>(`${this.apiUrl}/create-employee`, employee, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  // Shift endpoints
  createShift(shift: Shift): Observable<Shift> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.post<Shift>(`${this.apiUrl}/create-shift`, shift, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  assignEmployeeToShift(shiftId: number, employeeId: number): Observable<Shift> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.put<Shift>(`${this.apiUrl}/assigne-employee-shift/${shiftId}/${employeeId}`, {}, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  getShiftsOfEmployee(employeeId: number): Observable<Shift[]> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<Shift[]>(`${this.apiUrl}/${employeeId}/shifts`, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  getEmployeesOfShift(shiftId: number): Observable<Set<Employee>> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get<Set<Employee>>(`${this.apiUrl}/shift/${shiftId}/employees`, { headers })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  // Email and scheduling functionality
  sendEmail(to: string, subject: string, message: string): Observable<string> {
    const params = new HttpParams()
      .set('to', to)
      .set('subject', subject)
      .set('message', message);
    
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.post(`${this.apiUrl}/send`, null, { headers, params, responseType: 'text' })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  resetWeekAndNotifyManager(): Observable<string> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get(`${this.apiUrl}/reset-week`, { headers, responseType: 'text' })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }
   // Add this method to your EmployeeService.ts
getAllShifts(): Observable<Shift[]> {
  return from(this.keycloak.getToken()).pipe(
    switchMap(token => {
      if (!token) throw new Error('No token available');
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      return this.http.get<Shift[]>(`${this.apiUrl}/shifts`, { headers })
        .pipe(catchError(error => this.handleAuthError(error)));
    })
  );
}

  sendWeeklyShiftsToEmployees(): Observable<string> {
    return from(this.keycloak.getToken()).pipe(
      switchMap(token => {
        if (!token) throw new Error('No token available');
        
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.get(`${this.apiUrl}/send-weekly`, { headers, responseType: 'text' })
          .pipe(catchError(error => this.handleAuthError(error)));
      })
    );
  }

  // Implement proper auth error handling
  private handleAuthError(error: any) {
    if (error.status === 403) {
      alert('Permission denied - You must be logged in');
    } else if (error.status === 401) {
      this.keycloak.login(); // Redirect to login if token is invalid
    } else {
      console.error('Technical error:', error);
    }
    return throwError(() => error);
  }
}