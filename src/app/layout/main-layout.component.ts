import { Component, signal, inject, ApplicationRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  template: `
    <div class="min-h-screen flex w-full bg-zen-bg font-sans text-zen-text selection:bg-zen-accent/20">
      
      <!-- SIDEBAR SHADCN-STYLE -->
      <aside class="w-64 bg-zen-bg border-r border-stone-200/60 flex flex-col pt-8 pb-6 px-4 shrink-0">
        
        <!-- Logo / Marca -->
        <div class="flex items-center gap-3 mb-8 px-2">
          <div class="w-8 h-8 rounded-md bg-stone-100 border border-stone-200 flex items-center justify-center text-zen-accent shadow-sm">
            <span class="material-symbols-rounded text-lg" style="font-variation-settings: 'FILL' 1;">eco</span>
          </div>
          <div>
            <h1 class="font-semibold text-sm tracking-tight text-stone-900">Focus Sanctuary</h1>
            <p class="text-[10px] uppercase tracking-wider text-zen-text-light font-medium">Embrace the flow</p>
          </div>
        </div>

        <!-- Botón Principal -->
        <div class="px-2 mb-8">
          <button class="w-full flex items-center justify-center gap-2 bg-zen-accent text-white py-2 px-4 rounded-md text-sm font-medium shadow-sm hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 transition-all cursor-pointer">
            <span class="material-symbols-rounded text-[18px]">add</span>
            New Intent
          </button>
        </div>

        <!-- Navegación Principal -->
        <div class="px-2 mb-2">
          <p class="text-xs font-medium text-stone-400 mb-2 px-2">YOUR SPACES</p>
        </div>
        <nav class="flex flex-col gap-1 flex-grow px-2">
          
          <a routerLink="/" class="flex items-center gap-3 px-3 py-2 bg-stone-100 rounded-md text-stone-900 text-sm font-medium cursor-pointer transition-colors">
            <span class="material-symbols-rounded text-[20px] text-zen-accent" style="font-variation-settings: 'FILL' 1;">spa</span>
            Sanctuary
          </a>

          <a class="flex items-center gap-3 px-3 py-2 text-stone-600 rounded-md text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]" style="font-variation-settings: 'FILL' 0;">park</span>
            Task Garden
          </a>

          <a class="flex items-center gap-3 px-3 py-2 text-stone-600 rounded-md text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]" style="font-variation-settings: 'FILL' 0;">self_improvement</span>
            Reflection
          </a>
          
          <a class="flex items-center gap-3 px-3 py-2 text-stone-600 rounded-md text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]" style="font-variation-settings: 'FILL' 0;">calendar_month</span>
            Flow Calendar
          </a>

        </nav>
        
        <!-- Bottom Nav -->
        <nav class="flex flex-col gap-1 px-2 mt-auto">
          <a class="flex items-center gap-3 px-3 py-2 text-stone-500 rounded-md text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]">settings</span>
            Settings
          </a>
          <a class="flex items-center gap-3 px-3 py-2 text-stone-500 rounded-md text-sm font-medium hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]">help</span>
            Support
          </a>
          <button (click)="logout()" class="w-full flex items-center gap-3 px-3 py-2 mt-2 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer">
            <span class="material-symbols-rounded text-[20px]">logout</span>
            Cerrar sesión
          </button>
        </nav>

      </aside>

      <!-- ÁREA PRINCIPAL DINÁMICA -->
      <main class="flex-grow flex flex-col relative bg-zen-bg overflow-y-auto">
        
        <!-- Top Bar -->
        <header class="w-full flex items-center justify-between px-8 py-6">
          <div></div> <!-- Spacer -->
          <div class="flex items-center gap-4">
            <!-- Racha (Streak) -->
            <div class="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-full border border-stone-200">
              <span class="text-orange-500 text-sm">🔥</span>
              <span class="text-xs font-semibold text-stone-700">0</span>
            </div>
            
            <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer">
              <span class="material-symbols-rounded text-[20px]">language</span>
            </button>
            <div class="relative">
              <button 
                (click)="toggleSettings()" 
                [style.view-transition-name]="!isSettingsOpen() ? 'settings-panel' : 'none'"
                class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer">
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

        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class MainLayoutComponent {
  private appRef = inject(ApplicationRef);
  private authService = inject(AuthService);
  private router = inject(Router);
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
