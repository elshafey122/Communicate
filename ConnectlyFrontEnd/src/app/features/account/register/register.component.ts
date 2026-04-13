import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AccounService } from '../../../core/services/accoun.service';
import { RegisterDto } from '../../../shared/models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private accountService = inject(AccounService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  protected isLoading = signal(false);
  protected showPassword = signal(false);
  protected currentStep = signal(1);
  protected profileForm: FormGroup;
  protected credentialsForm: FormGroup;
  protected maxDate: string;

  protected countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
    'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
    'Denmark', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia',
    'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
    'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway',
    'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Thailand', 'Tunisia', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela', 'Vietnam', 'Yemen'
  ];

  constructor() {
    // Set max date to today minus 18 years for age validation
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    this.maxDate = maxDate.toISOString().split('T')[0];

    // Initialize forms
    this.credentialsForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.passwordValidator
          ]
        ],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.matchPasswords }
    );

    this.profileForm = this.fb.group({
      gender: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.ageValidator.bind(this)]],
      city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      country: ['', Validators.required],
    });

    // Watch isLoading signal and enable/disable forms automatically
    effect(() => {
      if (this.isLoading()) {
        this.credentialsForm.disable();
        this.profileForm.disable();
      } else {
        this.credentialsForm.enable();
        this.profileForm.enable();
      }
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
    const hasUniqueChars = new Set(value).size >= 2;
    return hasUppercase && hasLowercase && hasSpecialChar && hasUniqueChars ? null : { weakPassword: true };
  }

  matchPasswords(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
    if (actualAge < 18) return { minAge: true };
    if (actualAge > 120) return { maxAge: true };
    return null;
  }

  nextStep() {
    if (this.credentialsForm.valid) {
      this.currentStep.set(2);
    } else {
      this.credentialsForm.markAllAsTouched();
    }
  }

  prevStep() {
    this.currentStep.set(1);
  }

  passwordRequirements = [
    { label: 'One uppercase letter', check: (val: string) => /[A-Z]/.test(val) },
    { label: 'One lowercase letter', check: (val: string) => /[a-z]/.test(val) },
    { label: 'One special character', check: (val: string) => /[^a-zA-Z0-9]/.test(val) },
    { label: 'At least 2 unique characters', check: (val: string) => new Set(val).size >= 2 }
  ];

  get email() { return this.credentialsForm.get('email'); }
  get userName() { return this.credentialsForm.get('userName'); }
  get password() { return this.credentialsForm.get('password'); }
  get confirmPassword() { return this.credentialsForm.get('confirmPassword'); }
  get gender() { return this.profileForm.get('gender'); }
  get dateOfBirth() { return this.profileForm.get('dateOfBirth'); }
  get city() { return this.profileForm.get('city'); }
  get country() { return this.profileForm.get('country'); }

  register() {
    if (this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      this.currentStep.set(1);
      return;
    }
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    this.isLoading.set(true);
    
    const credentialsData = this.credentialsForm.value;
    const profileData = this.profileForm.value;
    
    // Format date properly for API - send as ISO string
    const dateOfBirth = new Date(profileData.dateOfBirth!);
const formattedDate = dateOfBirth.toISOString().split('T')[0]; // "YYYY-MM-DD"

const dto: RegisterDto = {
  ...credentialsData,
  ...profileData,
  dateOfBirth: formattedDate
};

    console.log('Sending registration data:', dto); // Debug log

    this.accountService.register(dto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading.set(false);
        if (error.status === 400) {
          console.log('Registration validation failed', error.error);
          // You might want to show specific error messages to the user here
        }
      }
    });
  }

  cancel() {
    this.router.navigate(['/home']);
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }
}