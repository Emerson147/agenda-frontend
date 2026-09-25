import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TareaEnfoqueService } from '../core/services/tarea-enfoque.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col w-full bg-zen-bg font-sans text-zen-text selection:bg-zen-accent/20 relative">
      
      <!-- TOP NAVIGATION BAR (Material Design 3 Zen Header) -->
      <header class="w-full flex items-center justify-between px-6 sm:px-10 py-4 border-b border-stone-200/60 bg-zen-bg/90 backdrop-blur-md sticky top-0 z-30">
        
        <!-- Left: Brand / Logo (matching Auth aesthetic) -->
        <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
          <div class="w-9 h-9 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-zen-accent shadow-xs group-hover:scale-105 transition-transform">
            <span class="material-symbols-rounded text-xl" style="font-variation-settings: 'FILL' 1;">eco</span>
          </div>
          <div>
            <h1 class="font-semibold text-sm tracking-tight text-stone-900 leading-tight">Focus Sanctuary</h1>
            <p class="text-[10px] uppercase tracking-wider text-zen-text-light font-medium">Embrace the flow</p>
          </div>
        </a>

        <!-- Center: Date & Intent Pill -->
        <div class="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 shadow-2xs text-xs text-stone-700">
          <span class="material-symbols-rounded text-base text-zen-accent">calendar_today</span>
          <span class="font-medium">Today</span>
          <span class="text-stone-300">·</span>
          <span class="text-stone-500">Mindful Timeboxing</span>
        </div>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-3">
          <!-- Streak Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs">
            <span class="text-orange-500 text-sm">🔥</span>
            <span class="text-xs font-semibold text-stone-700">5 days</span>
          </div>

          <!-- Language Selector -->
          <button 
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
            title="Language">
            <span class="material-symbols-rounded text-[20px]">language</span>
          </button>

          <!-- Settings Trigger -->
          <button 
            type="button"
            (click)="toggleSettings()" 
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
            title="Settings">
            <span class="material-symbols-rounded text-[20px]">settings</span>
          </button>

          <!-- Logout Button -->
          <button 
            type="button"
            (click)="logout()"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
            title="Cerrar sesión">
            <span class="material-symbols-rounded text-[20px]">logout</span>
          </button>
        </div>
      </header>

      <!-- MAIN ROUTER CONTENT (Bento Canvas) -->
      <main class="flex-1 w-full relative pb-28">
        <router-outlet></router-outlet>
      </main>

      <!-- FLOATING BOTTOM PILL DOCK (Material 3 Expressive Capsule) -->
      <nav 
        aria-label="Primary Navigation"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-stone-200/80 shadow-lg shadow-stone-900/5 select-none transition-all duration-200 hover:shadow-xl">
        
        <!-- Dashboard Button -->
        <a 
          routerLink="/"
          routerLinkActive="bg-stone-900 text-white shadow-xs font-medium"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer">
          <span class="material-symbols-rounded text-lg">space_dashboard</span>
          <span>Dashboard</span>
        </a>

        <!-- Focus Sanctuary Button (with live pulsing dot when timer is running) -->
        <a 
          routerLink="/sanctuary"
          routerLinkActive="bg-stone-900 text-white shadow-xs font-medium"
          class="relative flex items-center gap-2 px-4 py-2 rounded-full text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer">
          <span class="material-symbols-rounded text-lg">timer</span>
          <span>Sanctuary</span>

          @if (tareaService.isPomodoroActivo()) {
            <span class="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          }
        </a>

        <!-- Divider -->
        <div class="w-px h-5 bg-stone-200 my-auto mx-1"></div>

        <!-- Quick Settings Button -->
        <button 
          type="button"
          (click)="toggleSettings()"
          class="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer"
          title="Settings">
          <span class="material-symbols-rounded text-lg">tune</span>
          <span class="hidden sm:inline">Settings</span>
        </button>

      </nav>

      <!-- SETTINGS MODAL DIALOG -->
      @if (isSettingsOpen()) {
        <div class="fixed inset-0 bg-stone-900/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <aside class="w-full max-w-md bg-zen-bg rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-zen-accent text-xl">tune</span>
                <h2 class="text-sm font-semibold text-stone-800">Preferences & Sanctuary Timers</h2>
              </div>
              <button 
                type="button"
                (click)="toggleSettings()" 
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer">
                <span class="material-symbols-rounded text-[20px]">close</span>
              </button>
            </div>

            <div class="p-6 flex flex-col gap-6 max-h-[75vh] overflow-y-auto">
              <!-- Focus Duration -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-stone-700">
                  <span class="material-symbols-rounded text-[20px]">self_improvement</span>
                  <span class="text-xs font-medium">Focus duration</span>
                </div>
                <div class="flex items-center gap-2 bg-stone-100 rounded-xl p-1 border border-stone-200">
                  <span class="text-xs font-semibold w-12 text-center text-stone-800">45 min</span>
                </div>
              </div>

              <!-- Short Break Duration -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-stone-700">
                  <span class="material-symbols-rounded text-[20px]">coffee</span>
                  <span class="text-xs font-medium">Short break</span>
                </div>
                <div class="flex items-center gap-2 bg-stone-100 rounded-xl p-1 border border-stone-200">
                  <span class="text-xs font-semibold w-12 text-center text-stone-800">5 min</span>
                </div>
              </div>

              <!-- Long Break Duration -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-stone-700">
                  <span class="material-symbols-rounded text-[20px]">weekend</span>
                  <span class="text-xs font-medium">Long break</span>
                </div>
                <div class="flex items-center gap-2 bg-stone-100 rounded-xl p-1 border border-stone-200">
                  <span class="text-xs font-semibold w-12 text-center text-stone-800">15 min</span>
                </div>
              </div>

              <div class="h-px w-full bg-stone-100"></div>

              <!-- Soundscapes & Notifications -->
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3 text-stone-700">
                  <span class="material-symbols-rounded text-[20px]">notifications_active</span>
                  <span class="text-xs font-medium">Chime at end of cycle</span>
                </div>
                <div class="w-8 h-4 bg-zen-accent rounded-full flex items-center justify-end p-0.5 cursor-pointer">
                  <div class="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <div class="p-4 bg-stone-50/70 border-t border-stone-100 flex justify-end">
              <button 
                type="button" 
                (click)="toggleSettings()" 
                class="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 cursor-pointer">
                Done
              </button>
            </div>
          </aside>
        </div>
      }

    </div>
  `
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public tareaService = inject(TareaEnfoqueService);

  isSettingsOpen = signal<boolean>(false);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSettings() {
    this.isSettingsOpen.update(v => !v);
  }
}
