import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mediaFrame') mediaFrame!: ElementRef<HTMLDivElement>;
  @ViewChild('quoteCard') quoteCard!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    nombres: ['', Validators.required],
    apellidos: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=_!]).{8,}$')]]
  });

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  getFieldClasses(controlName: string): string {
    const control = this.registerForm.get(controlName);
    const isError = !!(control?.invalid && control?.touched);
    return isError
      ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/20 bg-rose-50/20'
      : 'border-stone-300 hover:border-stone-400 focus-within:border-zen-accent focus-within:ring-zen-accent/20';
  }

  ngAfterViewInit() {
    this.initEntranceAnimations();
  }

  private initEntranceAnimations() {
    const ctx = gsap.context(() => {
      // Settle inner form elements AFTER the 380ms GPU View Transition completes
      gsap.from('.anim-stagger', {
        opacity: 0,
        y: 10,
        duration: 0.35,
        stagger: 0.03,
        delay: 0.38,
        ease: 'power2.out',
        clearProps: 'all'
      });

      // Breathing ambient float for floating quote card
      if (this.quoteCard?.nativeElement) {
        gsap.to(this.quoteCard.nativeElement, {
          y: -6,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValues = this.registerForm.value;

      const payload = {
        nombre: formValues.nombres + ' ' + formValues.apellidos,
        email: formValues.email,
        password: formValues.password
      }

      this.authService.register(payload).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al registrarse:', err);
          this.errorMessage = err.error?.message || 'Error al registrarse. Intente nuevamente.';
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
