import { Component, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('mediaFrame') mediaFrame!: ElementRef<HTMLDivElement>;
  @ViewChild('quoteCard') quoteCard!: ElementRef<HTMLDivElement>;

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  getFieldClasses(controlName: string): string {
    const control = this.loginForm.get(controlName);
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
