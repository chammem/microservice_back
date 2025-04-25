import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.scss']
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  isEditMode = false;
  menuItem?: any;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      isVegetarian: [false],
      isAvailable: [true],
      allergens: [[]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.menuItem) {
      this.menuForm.patchValue(this.menuItem);
    }
  }
  get nameControl() {
    return this.menuForm.get('name');
  }
  
  get descriptionControl() {
    return this.menuForm.get('description');
  }
  

  get priceControl() {
    return this.menuForm.get('price');
  }
  onSubmit(): void {
    this.formSubmitted = true;
    if (this.menuForm.valid) {
      console.log('Form submitted:', this.menuForm.value);
    }
  }
}
