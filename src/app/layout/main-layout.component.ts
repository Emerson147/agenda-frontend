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
      
      <!-- MAIN ROUTER CONTENT (100% Full Width Screen Utilization) -->
      <main class="flex-1 w-full relative pb-28">
        <router-outlet></router-outlet>
      </main>

      <!-- FLOATING BOTTOM DOCK (Dynamic Island with expandable labels) -->
      <nav 
        aria-label="Floating Navigation Dock"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-stone-200/80 shadow-xl shadow-stone-900/5 select-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:shadow-2xl max-w-[95vw] sm:max-w-max">
        
        <!-- 1. Home / Dashboard (Active rounded circular button with expandable label) -->
        <a 
          routerLink="/"
          routerLinkActive="active-dock-item"
          [routerLinkActiveOptions]="{ exact: true }"
          #rlaDockHome="routerLinkActive"
          class="group flex items-center justify-center h-10 px-3 rounded-full transition-all duration-300 cursor-pointer text-xs font-medium shrink-0"
          [class.bg-stone-100]="rlaDockHome.isActive"
          [class.text-stone-950]="rlaDockHome.isActive"
          [class.shadow-2xs]="rlaDockHome.isActive"
          [class.text-stone-500]="!rlaDockHome.isActive"
          [class.hover:bg-stone-100]="!rlaDockHome.isActive"
          [class.hover:text-stone-900]="!rlaDockHome.isActive"
          title="Dashboard">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300" [class.icon-filled]="rlaDockHome.isActive">home</span>
          <span class="dock-label">Dashboard</span>
        </a>

        <!-- Divider -->
        <div class="w-px h-5 bg-stone-200 mx-1 shrink-0"></div>

        <!-- 2. Sanctuary (Pomodoro Room with live pulse badge and expandable label) -->
        <a 
          routerLink="/sanctuary"
          routerLinkActive="active-dock-item"
          #rlaDockSanct="routerLinkActive"
          class="group relative flex items-center justify-center h-10 px-3 rounded-full transition-all duration-300 cursor-pointer text-xs font-medium shrink-0"
          [class.bg-stone-100]="rlaDockSanct.isActive"
          [class.text-stone-950]="rlaDockSanct.isActive"
          [class.shadow-2xs]="rlaDockSanct.isActive"
          [class.text-stone-500]="!rlaDockSanct.isActive"
          [class.hover:bg-stone-100]="!rlaDockSanct.isActive"
          [class.hover:text-stone-900]="!rlaDockSanct.isActive"
          title="Sanctuary">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300" [class.icon-filled]="rlaDockSanct.isActive">timer</span>
          <span class="dock-label">Sanctuary</span>

          @if (tareaService.isPomodoroActivo()) {
            <span class="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          }
        </a>

        <!-- 3. Focus Intentions / Task Garden -->
        <button 
          type="button"
          class="group flex items-center justify-center h-10 px-3 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-300 cursor-pointer shrink-0"
          title="Focus Intentions">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">task_alt</span>
          <span class="dock-label">Intentions</span>
        </button>

        <!-- 4. Deep Work Analytics / Metrics -->
        <button 
          type="button"
          class="group flex items-center justify-center h-10 px-3 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-300 cursor-pointer shrink-0"
          title="Metrics & Insights">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">analytics</span>
          <span class="dock-label">Analytics</span>
        </button>

        <!-- 5. Soundscapes / Ambient Audio -->
        <button 
          type="button"
          class="group flex items-center justify-center h-10 px-3 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-300 cursor-pointer shrink-0"
          title="Soundscapes">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">graphic_eq</span>
          <span class="dock-label">Soundscapes</span>
        </button>

        <!-- 6. Weekly Review -->
        <button 
          type="button"
          class="group flex items-center justify-center h-10 px-3 rounded-full text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-300 cursor-pointer shrink-0"
          title="Weekly Review">
          <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">event_note</span>
          <span class="dock-label">Review</span>
        </button>

        <!-- Divider -->
        <div class="w-px h-5 bg-stone-200 mx-1 shrink-0"></div>

        <!-- 7. Language Switcher (ES) -->
        <button 
          type="button"
          class="w-10 h-10 flex items-center justify-center rounded-full text-[11px] font-mono font-bold tracking-widest text-stone-600 hover:text-emerald-700 hover:bg-stone-100 transition-all duration-300 cursor-pointer shrink-0"
          title="Language: Spanish">
          ES
        </button>

        <!-- 8. Night / Theme Toggle (with emerald squircle border) -->
        <button 
          type="button"
          (click)="toggleSettings()"
          class="w-9 h-9 rounded-xl border-2 border-emerald-500 text-stone-800 flex items-center justify-center hover:bg-emerald-50/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-2xs shrink-0"
          title="Preferences & Timers">
          <span class="material-symbols-rounded text-lg">dark_mode</span>
        </button>

        <!-- 9. Logout Button with label -->
        <button 
          type="button"
          (click)="logout()"
          class="group flex items-center justify-center h-10 px-2.5 rounded-full text-xs font-medium text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all duration-300 cursor-pointer shrink-0"
          title="Cerrar sesión">
          <span class="material-symbols-rounded text-lg group-hover:scale-110 transition-transform duration-300">logout</span>
          <span class="dock-label">Salir</span>
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
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .dock-label {
        max-width: 0;
        opacity: 0;
        overflow: hidden;
        white-space: nowrap;
        display: inline-block;
        transition: max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                    opacity 0.25s ease,
                    margin-left 0.3s ease;
      }

      @media (min-width: 768px) {
        .group:hover .dock-label,
        .group:focus-within .dock-label {
          max-width: 110px;
          opacity: 1;
          margin-left: 6px;
        }
      }
    `
  ]
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
