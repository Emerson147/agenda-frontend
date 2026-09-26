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
    <div class="min-h-screen w-full bg-zen-bg font-sans text-zen-text selection:bg-zen-accent/20 relative flex flex-col">
      
      <!-- TOP CONTEXT HEADER (Full-Width Clean Header) -->
      <header class="w-full flex items-center justify-between px-6 sm:px-10 py-4 border-b border-stone-200/60 bg-zen-bg/90 backdrop-blur-md sticky top-0 z-30 select-none">
        
        <!-- Left: Brand / Logo -->
        <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
          <div class="w-9 h-9 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-zen-accent shadow-xs group-hover:scale-105 transition-transform">
            <span class="material-symbols-rounded text-xl icon-filled">eco</span>
          </div>
          <div>
            <h1 class="font-semibold text-sm tracking-tight text-stone-900 leading-tight">Focus Sanctuary</h1>
            <p class="text-[10px] uppercase tracking-wider text-zen-text-light font-medium">Embrace the flow</p>
          </div>
        </a>

        <!-- Center: Date & Mindful Status Pill -->
        <div class="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 shadow-2xs text-xs text-stone-700">
          <span class="material-symbols-rounded text-base text-zen-accent">calendar_today</span>
          <span class="font-medium">Today</span>
          <span class="text-stone-300">·</span>
          <span class="text-stone-500">Mindful Timeboxing</span>
        </div>

        <!-- Right Quick Status -->
        <div class="flex items-center gap-3">
          <!-- Streak Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs text-xs">
            <span class="text-orange-500 text-sm">🔥</span>
            <span class="font-semibold text-stone-800">5-day streak</span>
          </div>

          <!-- User Profile Avatar -->
          <div class="w-8 h-8 rounded-full bg-zen-accent text-white flex items-center justify-center text-xs font-semibold shadow-2xs">
            P
          </div>
        </div>

      </header>

      <!-- MAIN ROUTER CONTENT (100% Full Width Screen Utilization) -->
      <main class="flex-1 w-full relative pb-28">
        <router-outlet></router-outlet>
      </main>

      <!-- FLOATING BOTTOM DOCK (Inspired 1:1 by your reference design) -->
      <nav 
        aria-label="Floating Navigation Dock"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-stone-200/90 shadow-xl shadow-stone-900/5 select-none transition-all duration-200 hover:shadow-2xl">
        
        <!-- 1. Home / Dashboard (Active rounded circular button) -->
        <a 
          routerLink="/"
          routerLinkActive="active-dock-item"
          [routerLinkActiveOptions]="{ exact: true }"
          #rlaDockHome="routerLinkActive"
          class="w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer hover:bg-stone-100"
          [class.bg-stone-100]="rlaDockHome.isActive"
          [class.text-stone-950]="rlaDockHome.isActive"
          [class.shadow-2xs]="rlaDockHome.isActive"
          [class.text-stone-500]="!rlaDockHome.isActive"
          title="Dashboard">
          <span class="material-symbols-rounded text-xl" [class.icon-filled]="rlaDockHome.isActive">home</span>
        </a>

        <!-- Divider -->
        <div class="w-px h-5 bg-stone-200 mx-1"></div>

        <!-- 2. Sanctuary (Pomodoro Room with live pulse badge) -->
        <a 
          routerLink="/sanctuary"
          routerLinkActive="active-dock-item"
          #rlaDockSanct="routerLinkActive"
          class="relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer hover:bg-stone-100"
          [class.bg-stone-100]="rlaDockSanct.isActive"
          [class.text-stone-950]="rlaDockSanct.isActive"
          [class.shadow-2xs]="rlaDockSanct.isActive"
          [class.text-stone-500]="!rlaDockSanct.isActive"
          title="Sanctuary">
          <span class="material-symbols-rounded text-xl" [class.icon-filled]="rlaDockSanct.isActive">timer</span>

          @if (tareaService.isPomodoroActivo()) {
            <span class="absolute top-1 right-1 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          }
        </a>

        <!-- 3. Focus Intentions / Task Garden -->
        <button 
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          title="Focus Intentions">
          <span class="material-symbols-rounded text-xl">task_alt</span>
        </button>

        <!-- 4. Deep Work Analytics / Metrics -->
        <button 
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          title="Metrics & Insights">
          <span class="material-symbols-rounded text-xl">analytics</span>
        </button>

        <!-- 5. Soundscapes / Ambient Audio -->
        <button 
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          title="Soundscapes">
          <span class="material-symbols-rounded text-xl">graphic_eq</span>
        </button>

        <!-- 6. Weekly Review -->
        <button 
          type="button"
          class="w-9 h-9 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer"
          title="Weekly Review">
          <span class="material-symbols-rounded text-xl">event_note</span>
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-stone-200 mx-1"></div>

        <!-- 7. Language Switcher (ES) -->
        <button 
          type="button"
          class="px-2 py-1 rounded-md text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Language: Spanish">
          ES
        </button>

        <!-- 8. Night / Theme Toggle (with emerald squircle border, 1:1 with reference) -->
        <button 
          type="button"
          (click)="toggleSettings()"
          class="w-9 h-9 rounded-xl border-2 border-emerald-500 text-stone-800 flex items-center justify-center hover:bg-emerald-50/50 active:scale-95 transition-all cursor-pointer shadow-2xs"
          title="Preferences & Theme">
          <span class="material-symbols-rounded text-lg">dark_mode</span>
        </button>

        <!-- 9. Logout Button -->
        <button 
          type="button"
          (click)="logout()"
          class="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          title="Cerrar sesión">
          <span class="material-symbols-rounded text-lg">logout</span>
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
