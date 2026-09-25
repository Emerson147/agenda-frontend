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
    <div class="min-h-screen w-full bg-zen-bg font-sans text-zen-text selection:bg-zen-accent/20 relative flex flex-col md:flex-row">
      
      <!-- 1. MATERIAL DESIGN 3 CANONICAL NAVIGATION RAIL (Desktop / Tablet >= 768px) -->
      <aside 
        aria-label="Main Navigation Rail"
        class="hidden md:flex w-[88px] h-screen fixed left-0 top-0 z-40 bg-white/75 backdrop-blur-md border-r border-stone-200/80 flex-col items-center justify-between py-6 px-2 select-none shrink-0">
        
        <!-- Top: Brand Mark & M3 FAB -->
        <div class="flex flex-col items-center gap-4 w-full">
          <!-- Sanctuary Logo Mark -->
          <a routerLink="/" class="w-11 h-11 rounded-2xl bg-stone-100 border border-stone-200/80 flex items-center justify-center text-zen-accent shadow-2xs hover:scale-105 transition-all cursor-pointer" title="Focus Sanctuary">
            <span class="material-symbols-rounded text-2xl" style="font-variation-settings: 'FILL' 1;">eco</span>
          </a>

          <!-- M3 Standard Floating Action Button (FAB) -->
          <button 
            type="button"
            routerLink="/"
            class="w-14 h-14 rounded-2xl bg-zen-accent text-white flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer group"
            title="New Intention">
            <span class="material-symbols-rounded text-2xl group-hover:rotate-90 transition-transform duration-200">add</span>
          </button>
        </div>

        <!-- Center: M3 Navigation Rail Destinations -->
        <nav class="flex flex-col items-center gap-4 w-full my-auto">
          
          <!-- Destination 1: Dashboard -->
          <a 
            routerLink="/"
            routerLinkActive="active-destination"
            [routerLinkActiveOptions]="{ exact: true }"
            #rlaDashboard="routerLinkActive"
            class="flex flex-col items-center group cursor-pointer w-full text-center">
            <!-- M3 Active Pill Container -->
            <div 
              class="w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200"
              [class.bg-emerald-100]="rlaDashboard.isActive"
              [class.text-emerald-950]="rlaDashboard.isActive"
              [class.text-stone-500]="!rlaDashboard.isActive"
              [class.group-hover:bg-stone-100]="!rlaDashboard.isActive">
              <span 
                class="material-symbols-rounded text-[22px]" 
                [class.icon-filled]="rlaDashboard.isActive">
                space_dashboard
              </span>
            </div>
            <span 
              class="text-[11px] mt-1 transition-colors leading-tight"
              [class.font-semibold]="rlaDashboard.isActive"
              [class.text-stone-900]="rlaDashboard.isActive"
              [class.text-stone-500]="!rlaDashboard.isActive">
              Dashboard
            </span>
          </a>

          <!-- Destination 2: Sanctuary (with live M3 Badge) -->
          <a 
            routerLink="/sanctuary"
            routerLinkActive="active-destination"
            #rlaSanctuary="routerLinkActive"
            class="flex flex-col items-center group cursor-pointer w-full text-center relative">
            <!-- M3 Active Pill Container -->
            <div 
              class="w-14 h-8 rounded-full flex items-center justify-center transition-all duration-200 relative"
              [class.bg-emerald-100]="rlaSanctuary.isActive"
              [class.text-emerald-950]="rlaSanctuary.isActive"
              [class.text-stone-500]="!rlaSanctuary.isActive"
              [class.group-hover:bg-stone-100]="!rlaSanctuary.isActive">
              <span 
                class="material-symbols-rounded text-[22px]" 
                [class.icon-filled]="rlaSanctuary.isActive">
                timer
              </span>

              <!-- Live M3 State Badge -->
              @if (tareaService.isPomodoroActivo()) {
                <span class="absolute top-1 right-3 flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              } @else {
                <span class="absolute top-1 right-3.5 w-1.5 h-1.5 rounded-full bg-stone-300"></span>
              }
            </div>
            <span 
              class="text-[11px] mt-1 transition-colors leading-tight"
              [class.font-semibold]="rlaSanctuary.isActive"
              [class.text-stone-900]="rlaSanctuary.isActive"
              [class.text-stone-500]="!rlaSanctuary.isActive">
              Sanctuary
            </span>
          </a>

          <!-- Destination 3: Metrics / Analytics -->
          <a 
            routerLink="/"
            class="flex flex-col items-center group cursor-pointer w-full text-center">
            <div class="w-14 h-8 rounded-full flex items-center justify-center text-stone-500 group-hover:bg-stone-100 transition-all duration-200">
              <span class="material-symbols-rounded text-[22px]">analytics</span>
            </div>
            <span class="text-[11px] mt-1 text-stone-500 group-hover:text-stone-800 transition-colors leading-tight">
              Metrics
            </span>
          </a>

        </nav>

        <!-- Bottom: Utilities, Settings & Logout -->
        <div class="flex flex-col items-center gap-3 w-full">
          <!-- Settings Trigger -->
          <button 
            type="button"
            (click)="toggleSettings()"
            class="w-10 h-10 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            title="Settings">
            <span class="material-symbols-rounded text-xl">tune</span>
          </button>

          <!-- Logout Button -->
          <button 
            type="button"
            (click)="logout()"
            class="w-10 h-10 rounded-full flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Log out">
            <span class="material-symbols-rounded text-xl">logout</span>
          </button>
        </div>

      </aside>

      <!-- 2. MOBILE MATERIAL 3 NAVIGATION BAR (Visible only on < md screens) -->
      <nav 
        aria-label="Mobile Navigation Bar"
        class="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-t border-stone-200/80 z-40 items-center justify-around px-2 select-none shadow-lg">
        
        <!-- Mobile Dashboard -->
        <a 
          routerLink="/"
          routerLinkActive="text-stone-900 font-semibold"
          [routerLinkActiveOptions]="{ exact: true }"
          #rlaMobileDash="routerLinkActive"
          class="flex flex-col items-center cursor-pointer">
          <div 
            class="w-12 h-7 rounded-full flex items-center justify-center transition-all"
            [class.bg-emerald-100]="rlaMobileDash.isActive"
            [class.text-emerald-950]="rlaMobileDash.isActive"
            [class.text-stone-500]="!rlaMobileDash.isActive">
            <span class="material-symbols-rounded text-xl">space_dashboard</span>
          </div>
          <span class="text-[10px] mt-0.5">Dashboard</span>
        </a>

        <!-- Mobile Sanctuary -->
        <a 
          routerLink="/sanctuary"
          routerLinkActive="text-stone-900 font-semibold"
          #rlaMobileSanct="routerLinkActive"
          class="flex flex-col items-center cursor-pointer relative">
          <div 
            class="w-12 h-7 rounded-full flex items-center justify-center transition-all relative"
            [class.bg-emerald-100]="rlaMobileSanct.isActive"
            [class.text-emerald-950]="rlaMobileSanct.isActive"
            [class.text-stone-500]="!rlaMobileSanct.isActive">
            <span class="material-symbols-rounded text-xl">timer</span>
            @if (tareaService.isPomodoroActivo()) {
              <span class="absolute top-1 right-2 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            }
          </div>
          <span class="text-[10px] mt-0.5">Sanctuary</span>
        </a>

        <!-- Mobile Settings -->
        <button 
          type="button"
          (click)="toggleSettings()"
          class="flex flex-col items-center cursor-pointer text-stone-500">
          <div class="w-12 h-7 rounded-full flex items-center justify-center">
            <span class="material-symbols-rounded text-xl">tune</span>
          </div>
          <span class="text-[10px] mt-0.5">Settings</span>
        </button>

      </nav>

      <!-- 3. MAIN CONTENT CANVAS (Clean, without bottom obstruction on Desktop) -->
      <div class="flex-1 md:ml-[88px] min-h-screen flex flex-col relative pb-20 md:pb-8">
        
        <!-- Top Context Header -->
        <header class="w-full flex items-center justify-between px-6 sm:px-10 py-4 border-b border-stone-200/60 bg-zen-bg/90 backdrop-blur-md sticky top-0 z-30">
          
          <div class="flex items-center gap-3">
            <!-- Mobile Brand Toggle (hidden on desktop where rail is present) -->
            <div class="flex md:hidden items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-zen-accent shadow-2xs">
                <span class="material-symbols-rounded text-lg" style="font-variation-settings: 'FILL' 1;">eco</span>
              </div>
              <span class="font-semibold text-xs text-stone-900">Focus Sanctuary</span>
            </div>

            <!-- Desktop Today Intentions Subtitle -->
            <div class="hidden md:flex items-center gap-2 text-xs text-stone-500">
              <span class="font-semibold text-stone-800">Focus Sanctuary</span>
              <span>/</span>
              <span>Daily Flow & Timeboxing</span>
            </div>
          </div>

          <!-- Right Status Chips -->
          <div class="flex items-center gap-3">
            <!-- Streak M3 Assist Chip -->
            <div class="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full border border-stone-200/80 shadow-2xs text-xs">
              <span class="text-orange-500 text-sm">🔥</span>
              <span class="font-semibold text-stone-800">5-day streak</span>
            </div>

            <!-- Language Switcher -->
            <button 
              type="button"
              class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
              title="Language">
              <span class="material-symbols-rounded text-[20px]">language</span>
            </button>

            <!-- User Avatar -->
            <div class="w-8 h-8 rounded-full bg-zen-accent text-white flex items-center justify-center text-xs font-semibold shadow-2xs">
              P
            </div>
          </div>

        </header>

        <!-- Router Outlet Content -->
        <main class="flex-1 w-full">
          <router-outlet></router-outlet>
        </main>

      </div>

      <!-- 4. SETTINGS MODAL DIALOG -->
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
