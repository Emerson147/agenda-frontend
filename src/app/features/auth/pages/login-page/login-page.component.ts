import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Credenciales inválidas o error de conexión.';
          console.error('Login error', err);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
