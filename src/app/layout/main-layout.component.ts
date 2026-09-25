import { Component, signal, inject, ApplicationRef } from '@angular/core';
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
      
      <!-- TOP NAVIGATION BAR (Minimal Zen Header) -->
      <header class="w-full flex items-center justify-between px-4 sm:px-8 py-4 border-b border-stone-200/60 bg-zen-bg/90 backdrop-blur-sm sticky top-0 z-30">
        <!-- Brand / Logo -->
        <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
          <div class="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-zen-accent shadow-xs group-hover:scale-105 transition-transform">
            <span class="material-symbols-rounded text-lg" style="font-variation-settings: 'FILL' 1;">eco</span>
          </div>
          <div>
            <h1 class="font-semibold text-sm tracking-tight text-stone-900 leading-tight">Focus Sanctuary</h1>
            <p class="text-[10px] uppercase tracking-wider text-zen-text-light font-medium">Embrace the flow</p>
          </div>
        </a>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-3">
          <!-- Streak Pill -->
          <div class="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100/80 rounded-full border border-stone-200/80">
            <span class="text-orange-500 text-sm">🔥</span>
            <span class="text-xs font-semibold text-stone-700">5</span>
          </div>

          <!-- Language Selector -->
          <button 
            type="button"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
            title="Language">
            <span class="material-symbols-rounded text-[20px]">language</span>
          </button>

          <!-- Settings Trigger -->
          <div class="relative">
            <button 
              type="button"
              (click)="toggleSettings()" 
              [style.view-transition-name]="!isSettingsOpen() ? 'settings-panel' : 'none'"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
              title="Settings">
              <span class="material-symbols-rounded text-[20px]">settings</span>
            </button>

            <!-- SETTINGS POPOVER -->
            @if (isSettingsOpen()) {
              <aside 
                [style.view-transition-name]="'settings-panel'"
                class="absolute top-12 right-0 w-[360px] bg-zen-bg rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden z-50 origin-top-right">
                
                <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
                  <h2 class="text-sm font-semibold text-stone-800">Settings</h2>
                  <button (click)="toggleSettings()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer">
                    <span class="material-symbols-rounded text-[20px]">close</span>
                  </button>
                </div>

                <div class="p-5 flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
                  <!-- SECTION: TIMER -->
                  <section class="flex flex-col gap-3">
                    <p class="text-[10px] font-bold tracking-widest text-stone-400 uppercase">Timer</p>

                    <!-- Focus Duration -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-stone-600">
                        <span class="material-symbols-rounded text-[18px]">self_improvement</span>
                        <span class="text-xs font-medium">Focus duration</span>
                      </div>
                      <div class="flex items-center gap-2 bg-stone-100 rounded-md p-1 border border-stone-200">
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">remove</span></button>
                        <span class="text-xs font-semibold w-10 text-center text-stone-700">45 min</span>
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">add</span></button>
                      </div>
                    </div>

                    <!-- Short Break Duration -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-stone-600">
                        <span class="material-symbols-rounded text-[18px]">coffee</span>
                        <span class="text-xs font-medium">Short break</span>
                      </div>
                      <div class="flex items-center gap-2 bg-stone-100 rounded-md p-1 border border-stone-200">
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">remove</span></button>
                        <span class="text-xs font-semibold w-10 text-center text-stone-700">5 min</span>
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">add</span></button>
                      </div>
                    </div>

                    <!-- Long Break Duration -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-stone-600">
                        <span class="material-symbols-rounded text-[18px]">weekend</span>
                        <span class="text-xs font-medium">Long break</span>
                      </div>
                      <div class="flex items-center gap-2 bg-stone-100 rounded-md p-1 border border-stone-200">
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">remove</span></button>
                        <span class="text-xs font-semibold w-10 text-center text-stone-700">15 min</span>
                        <button class="w-6 h-6 flex items-center justify-center text-stone-500 hover:text-stone-800"><span class="material-symbols-rounded text-[16px]">add</span></button>
                      </div>
                    </div>

                    <div class="h-px w-full bg-stone-100 my-1"></div>

                    <!-- Toggles -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-stone-600">
                        <span class="material-symbols-rounded text-[18px]">auto_mode</span>
                        <span class="text-xs font-medium">Auto-start breaks</span>
                      </div>
                      <div class="w-8 h-4 bg-stone-200 rounded-full flex items-center p-0.5 cursor-pointer">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3 text-stone-600">
                        <span class="material-symbols-rounded text-[18px]">replay</span>
                        <span class="text-xs font-medium">Auto-start focus</span>
                      </div>
                      <div class="w-8 h-4 bg-zen-accent rounded-full flex items-center justify-end p-0.5 cursor-pointer">
                        <div class="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>

                  </section>
                </div>
              </aside>
            }
          </div>
        </div>
      </header>

      <!-- MAIN ROUTER CONTENT -->
      <main class="flex-1 w-full relative overflow-y-auto">
        <router-outlet></router-outlet>
      </main>

      <!-- FLOATING BOTTOM PILL DOCK (Sunsama / Linear / Dynamic Island Style) -->
      <nav 
        aria-label="Primary Navigation"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-stone-200/80 shadow-lg shadow-stone-900/5 select-none transition-all duration-200 hover:shadow-xl">
        
        <!-- Dashboard Button -->
        <a 
          routerLink="/"
          routerLinkActive="bg-stone-900 text-white shadow-xs font-medium"
          [routerLinkActiveOptions]="{ exact: true }"
          class="flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer">
          <span class="material-symbols-rounded text-lg">space_dashboard</span>
          <span class="hidden sm:inline">Dashboard</span>
        </a>

        <!-- Focus Sanctuary Button (with live pulsing dot when timer is running) -->
        <a 
          routerLink="/sanctuary"
          routerLinkActive="bg-stone-900 text-white shadow-xs font-medium"
          class="relative flex items-center gap-2 px-3.5 py-2 rounded-full text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/80 transition-all cursor-pointer">
          <span class="material-symbols-rounded text-lg">timer</span>
          <span class="hidden sm:inline">Sanctuary</span>

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

        <!-- Logout Button -->
        <button 
          type="button"
          (click)="logout()"
          class="flex items-center justify-center w-8 h-8 rounded-full text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          title="Log out">
          <span class="material-symbols-rounded text-lg">logout</span>
        </button>

      </nav>

    </div>
  `
})
export class MainLayoutComponent {
  private appRef = inject(ApplicationRef);
  private authService = inject(AuthService);
  private router = inject(Router);
  public tareaService = inject(TareaEnfoqueService);

  isSettingsOpen = signal<boolean>(false);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSettings() {
    if (!document.startViewTransition) {
      this.isSettingsOpen.update(v => !v);
      return;
    }

    document.startViewTransition(() => {
      this.isSettingsOpen.update(v => !v);
      this.appRef.tick();
    });
  }
}
