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
    <div class="h-screen w-screen flex bg-zen-bg font-sans text-zen-text selection:bg-zen-accent/20 overflow-hidden">
      
      <!-- 1. LEFT NAVIGATION SIDEBAR (Sunsama / M3 Expressive) -->
      <aside class="w-60 bg-white/70 backdrop-blur-md border-r border-stone-200/80 flex flex-col justify-between p-4 shrink-0 z-20 select-none">
        
        <!-- Top Section: Workspace Selector & Primary Navigation -->
        <div class="flex flex-col gap-6">
          
          <!-- Workspace Menu (Sunsama style dropdown) -->
          <div class="flex items-center justify-between px-2 py-1.5 rounded-2xl hover:bg-stone-100/80 cursor-pointer transition-colors group">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-zen-accent shadow-2xs group-hover:scale-105 transition-transform">
                <span class="material-symbols-rounded text-base" style="font-variation-settings: 'FILL' 1;">eco</span>
              </div>
              <span class="font-semibold text-xs tracking-tight text-stone-900">Focus Sanctuary</span>
            </div>
            <span class="material-symbols-rounded text-stone-400 text-sm group-hover:text-stone-700 transition-colors">unfold_more</span>
          </div>

          <!-- Primary App Spaces -->
          <nav class="flex flex-col gap-1">
            <!-- Home / Dashboard -->
            <a 
              routerLink="/"
              routerLinkActive="bg-stone-100 text-stone-900 font-semibold shadow-2xs"
              [routerLinkActiveOptions]="{ exact: true }"
              class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[18px]">home</span>
              <span>Home</span>
            </a>

            <!-- Today Plan -->
            <a 
              routerLink="/"
              class="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[18px]">today</span>
              <span>Today</span>
            </a>

            <!-- Focus Sanctuary (Immersive Pomodoro Room) -->
            <a 
              routerLink="/sanctuary"
              routerLinkActive="bg-stone-900 text-white font-semibold shadow-xs"
              class="relative flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[18px]">timer</span>
              <span>Focus Room</span>

              @if (tareaService.isPomodoroActivo()) {
                <span class="ml-auto flex h-2 w-2 relative">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              }
            </a>
          </nav>

          <!-- Rituals: DAY -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold tracking-wider text-stone-400 uppercase px-3 mb-1">Day</span>
            
            <a class="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[17px] text-stone-400">wb_sunny</span>
              <span>Daily planning</span>
            </a>

            <a class="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[17px] text-stone-400">bedtime</span>
              <span>Daily shutdown</span>
            </a>

            <a class="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[17px] text-stone-400">stylus_note</span>
              <span>Daily highlights</span>
            </a>
          </div>

          <!-- Rituals: WEEK -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold tracking-wider text-stone-400 uppercase px-3 mb-1">Week</span>
            
            <a class="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[17px] text-stone-400">event_note</span>
              <span>Weekly planning</span>
            </a>

            <a class="flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all cursor-pointer">
              <span class="material-symbols-rounded text-[17px] text-stone-400">analytics</span>
              <span>Weekly review</span>
            </a>
          </div>

        </div>

        <!-- Bottom Sidebar Section: Streak & User profile -->
        <div class="pt-4 border-t border-stone-200/70 flex flex-col gap-3">
          <!-- Streak Indicator -->
          <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-stone-100/60 border border-stone-200/70">
            <div class="flex items-center gap-2">
              <span class="text-sm">🔥</span>
              <span class="text-xs font-semibold text-stone-700">5-day streak</span>
            </div>
            <span class="text-[10px] text-zen-accent font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">Flow</span>
          </div>

          <!-- User & Actions -->
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full bg-zen-accent text-white flex items-center justify-center text-xs font-semibold">
                M
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-medium text-stone-800 leading-tight">Practitioner</span>
                <span class="text-[10px] text-stone-400">Online</span>
              </div>
            </div>

            <!-- Settings & Logout Buttons -->
            <div class="flex items-center gap-1">
              <button 
                type="button"
                (click)="toggleSettings()"
                title="Settings"
                class="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer">
                <span class="material-symbols-rounded text-[18px]">settings</span>
              </button>
              <button 
                type="button"
                (click)="logout()"
                title="Log out"
                class="w-7 h-7 flex items-center justify-center rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                <span class="material-symbols-rounded text-[18px]">logout</span>
              </button>
            </div>
          </div>
        </div>

      </aside>

      <!-- 2. CENTRAL WORKSPACE CANVAS (Router Outlet: Kanban + Timeline) -->
      <main class="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-zen-bg">
        <router-outlet></router-outlet>
      </main>

      <!-- 3. RIGHT UTILITY DOCK / INTEGRATIONS RIBBON (Sunsama style far-right bar) -->
      <aside class="w-14 bg-white/70 backdrop-blur-md border-l border-stone-200/80 flex flex-col items-center justify-between py-4 shrink-0 z-20 select-none">
        
        <!-- Top Integrations: Google Calendar, Notion, Jira/Asana -->
        <div class="flex flex-col items-center gap-3">
          <!-- Google Calendar Icon -->
          <button 
            type="button"
            title="Google Calendar Connected"
            class="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-2xs hover:scale-105 transition-all cursor-pointer">
            <span class="text-xs font-semibold text-blue-600">31</span>
          </button>

          <!-- Notion Sync Icon -->
          <button 
            type="button"
            title="Notion Workspace"
            class="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center shadow-2xs hover:scale-105 transition-all cursor-pointer">
            <span class="text-xs font-bold text-stone-800">N</span>
          </button>

          <!-- Task Garden / Projects -->
          <button 
            type="button"
            title="Projects & Tags"
            class="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-rose-500 shadow-2xs hover:scale-105 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">hub</span>
          </button>

          <!-- Trello / Kanban Sync -->
          <button 
            type="button"
            title="Board Connections"
            class="w-8 h-8 rounded-xl bg-white border border-stone-200/80 flex items-center justify-center text-blue-500 shadow-2xs hover:scale-105 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">view_column</span>
          </button>

          <div class="w-6 h-px bg-stone-200 my-1"></div>

          <!-- Quick Pomodoro Stats -->
          <button 
            type="button"
            title="Focus Stats & Targets"
            class="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">target</span>
          </button>

          <!-- Archive / Completed -->
          <button 
            type="button"
            title="Archive"
            class="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">inventory_2</span>
          </button>

          <!-- Ambient Soundscapes -->
          <button 
            type="button"
            title="Soundscapes"
            class="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">graphic_eq</span>
          </button>
        </div>

        <!-- Bottom Utility Buttons: Search, Theme, Quick Add -->
        <div class="flex flex-col items-center gap-2.5">
          <!-- Search -->
          <button 
            type="button"
            title="Search (⌘K)"
            class="w-8 h-8 rounded-xl hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">search</span>
          </button>

          <!-- Quick Add FAB (Material 3 Expressive) -->
          <button 
            type="button"
            title="New Intention (+)"
            class="w-8 h-8 rounded-xl bg-zen-accent text-white flex items-center justify-center shadow-xs hover:bg-stone-800 hover:scale-105 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-lg">add</span>
          </button>
        </div>

      </aside>

      <!-- SETTINGS POPOVER / MODAL -->
      @if (isSettingsOpen()) {
        <div class="fixed inset-0 bg-stone-900/20 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <aside class="w-full max-w-md bg-zen-bg rounded-3xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div class="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/70">
              <div class="flex items-center gap-2">
                <span class="material-symbols-rounded text-zen-accent text-xl">tune</span>
                <h2 class="text-sm font-semibold text-stone-800">Preferences & Timers</h2>
              </div>
              <button (click)="toggleSettings()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 text-stone-500 transition-colors cursor-pointer">
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
                class="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 cursor-pointer">
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
