import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TareaEnfoqueService } from '../../../core/services/tarea-enfoque.service';
import { LayoutService, NavigationStyle } from '../../../core/services/layout.service';

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (layoutService.navigationStyle() === 'Dock') {
      <!-- Dock Wrapper -->
      <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 w-max">
        
        <!-- Dock Navigation -->
        <nav 
          aria-label="Floating Navigation Dock"
          class="flex items-center p-2 gap-1 bg-md-sys-surface dark:bg-md-sys-surface-container-high rounded-full shadow-2xl select-none border border-md-sys-outline/10">
          
          <!-- 1. Home / Dashboard -->
          <a 
            routerLink="/"
            routerLinkActive="active-dock-item"
            [routerLinkActiveOptions]="{ exact: true }"
            #rlaDockHome="routerLinkActive"
            class="group flex items-center justify-center h-12 transition-all duration-300 cursor-pointer rounded-full"
            [class.w-20]="rlaDockHome.isActive"
            [class.w-12]="!rlaDockHome.isActive"
            [class.bg-md-sys-primary]="rlaDockHome.isActive"
            [class.text-md-sys-on-primary]="rlaDockHome.isActive"
            [class.text-md-sys-on-surface-variant]="!rlaDockHome.isActive"
            [class.hover:bg-md-sys-surface-container-highest]="!rlaDockHome.isActive"
            [class.hover:text-md-sys-on-surface]="!rlaDockHome.isActive"
            title="Dashboard">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300" [class.icon-filled]="rlaDockHome.isActive">home</span>
          </a>

          <!-- 2. Sanctuary -->
          <a 
            routerLink="/sanctuary"
            routerLinkActive="active-dock-item"
            #rlaDockSanct="routerLinkActive"
            class="group relative flex items-center justify-center h-12 transition-all duration-300 cursor-pointer rounded-full"
            [class.w-20]="rlaDockSanct.isActive"
            [class.w-12]="!rlaDockSanct.isActive"
            [class.bg-md-sys-primary]="rlaDockSanct.isActive"
            [class.text-md-sys-on-primary]="rlaDockSanct.isActive"
            [class.text-md-sys-on-surface-variant]="!rlaDockSanct.isActive"
            [class.hover:bg-md-sys-surface-container-highest]="!rlaDockSanct.isActive"
            [class.hover:text-md-sys-on-surface]="!rlaDockSanct.isActive"
            title="Sanctuary">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300" [class.icon-filled]="rlaDockSanct.isActive">timer</span>
            @if (tareaService.isPomodoroActivo()) {
              <span class="absolute top-2 right-2 flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            }
          </a>

          <!-- 3. Focus Intentions -->
          <button 
            type="button"
            class="group flex items-center justify-center h-12 w-12 rounded-full text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-highest transition-all duration-300 cursor-pointer"
            title="Focus Intentions">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300">task_alt</span>
          </button>

          <!-- 4. Analytics -->
          <button 
            type="button"
            class="group flex items-center justify-center h-12 w-12 rounded-full text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-highest transition-all duration-300 cursor-pointer"
            title="Metrics & Insights">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300">analytics</span>
          </button>

          <!-- 5. Soundscapes -->
          <button 
            type="button"
            class="group flex items-center justify-center h-12 w-12 rounded-full text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-highest transition-all duration-300 cursor-pointer"
            title="Soundscapes">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300">graphic_eq</span>
          </button>

          <!-- 6. Weekly Review -->
          <button 
            type="button"
            class="group flex items-center justify-center h-12 w-12 rounded-full text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-highest transition-all duration-300 cursor-pointer"
            title="Weekly Review">
            <span class="material-symbols-rounded text-[22px] transition-transform duration-300">event_note</span>
          </button>
        </nav>

        <!-- Separate Options FAB -->
        <div class="relative">
          <button 
            type="button"
            (click)="toggleOptionsMenu()"
            class="flex items-center justify-center w-14 h-14 rounded-[1.25rem] shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer focus:outline-none"
            [ngClass]="{
              'bg-blue-600 text-white': !isOptionsOpen,
              'bg-md-sys-surface-container-high text-md-sys-on-surface border border-md-sys-outline/20': isOptionsOpen
            }"
            title="Opciones">
            <span class="material-symbols-rounded text-[24px] transition-transform duration-300" [class.rotate-90]="isOptionsOpen" [class.icon-filled]="isOptionsOpen">
              {{ isOptionsOpen ? 'close' : 'apps' }}
            </span>
          </button>

          <!-- Options Popover -->
          @if (isOptionsOpen && !isAppearanceOpen) {
            <div class="absolute bottom-[4.5rem] right-0 w-56 bg-md-sys-surface-container-high rounded-3xl p-3 shadow-2xl border border-md-sys-outline/20 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 origin-bottom-right">
              <div class="px-3 py-2 mb-1">
                <span class="text-lg font-semibold text-md-sys-on-surface border-2 border-md-sys-outline/30 rounded px-1">Opciones</span>
              </div>
              
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">add</span>
                Crear transferencia
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">view_column</span>
                Campos adicionales
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">settings</span>
                Configuración
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">refresh</span>
                Recargar App
              </button>
              <button (click)="openAppearance()" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">palette</span>
                Apariencia
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">feedback</span>
                Dar Feedback
              </button>
              <button (click)="logout()" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-error-container hover:text-md-sys-error rounded-xl transition-colors mt-1">
                <span class="material-symbols-rounded text-[18px]">logout</span>
                Cerrar Sesión
              </button>
            </div>
          }

          <!-- Appearance Sub-Popover -->
          @if (isOptionsOpen && isAppearanceOpen) {
            <div class="absolute bottom-[4.5rem] right-0 w-64 bg-md-sys-surface-container-high rounded-3xl p-4 shadow-2xl border border-md-sys-outline/20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 origin-bottom-right">
              <div class="flex items-center gap-2">
                <button (click)="closeAppearance()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-md-sys-surface-container-highest text-md-sys-on-surface-variant">
                  <span class="material-symbols-rounded text-[20px]">arrow_back</span>
                </button>
                <span class="text-base font-semibold text-md-sys-on-surface flex items-center gap-2">
                  <span class="material-symbols-rounded text-[18px]">palette</span>
                  Apariencia
                </span>
              </div>

              <!-- Modo Oscuro -->
              <button 
                (click)="layoutService.toggleDarkMode()"
                class="flex items-center justify-between w-full px-3 py-2 -mx-1 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-rounded text-[18px]">
                    {{ layoutService.isDarkMode() ? 'dark_mode' : 'light_mode' }}
                  </span>
                  <span>Modo oscuro</span>
                </div>
                <div 
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                  [class.bg-emerald-500]="layoutService.isDarkMode()"
                  [class.bg-md-sys-surface-variant]="!layoutService.isDarkMode()">
                  <span 
                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm"
                    [class.translate-x-4]="layoutService.isDarkMode()"
                    [class.translate-x-1]="!layoutService.isDarkMode()">
                  </span>
                </div>
              </button>

              <div class="h-px w-full bg-md-sys-outline/20"></div>

              <!-- Colors Grid -->
              <div class="grid grid-cols-5 gap-3">
                @for (color of colors; track color.id) {
                  <button 
                    (click)="layoutService.setThemeColor(color.id)"
                    class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                    [class.border-white]="layoutService.themeColor() === color.id"
                    [class.border-transparent]="layoutService.themeColor() !== color.id"
                    [class.scale-110]="layoutService.themeColor() === color.id"
                    [style.background]="color.bg">
                  </button>
                }
              </div>

              <div class="h-px w-full bg-md-sys-outline/20"></div>

              <!-- Navigation Style Grid -->
              <div class="flex flex-col gap-2">
                <span class="text-[11px] text-md-sys-on-surface-variant uppercase tracking-wider font-medium">Navegación</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (style of navStyles; track style) {
                    <button 
                      (click)="layoutService.setNavigationStyle(style)"
                      class="py-2 px-1 text-xs font-medium rounded-xl transition-colors text-center"
                      [class.bg-orange-500]="layoutService.navigationStyle() === style"
                      [class.text-white]="layoutService.navigationStyle() === style"
                      [class.bg-md-sys-surface-container-highest]="layoutService.navigationStyle() !== style"
                      [class.text-md-sys-on-surface-variant]="layoutService.navigationStyle() !== style"
                      [class.hover:text-md-sys-on-surface]="layoutService.navigationStyle() !== style">
                      {{ style }}
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    } @else {
      <aside [class]="sidebarContainerClass">
        <!-- Header / Logo -->
        <div [class]="headerClass">
          <span class="text-xl font-bold text-md-sys-on-surface flex items-center justify-center gap-2">
            <span class="material-symbols-rounded text-2xl text-primary transition-transform hover:rotate-12 duration-300">auto_awesome</span>
            @if (showLabels) {
              <span class="whitespace-nowrap transition-opacity duration-300">Pomodoro App</span>
            }
          </span>
        </div>

        <!-- Navigation Links -->
        <nav [class]="navContainerClass">
          
          <!-- Dashboard -->
          <a 
            routerLink="/"
            routerLinkActive="active-sidebar-item"
            [routerLinkActiveOptions]="{ exact: true }"
            #rlaDockHome="routerLinkActive"
            [class]="getItemClass(rlaDockHome.isActive)"
            [class.active-item-custom]="rlaDockHome.isActive">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300" [class.icon-filled]="rlaDockHome.isActive">home</span>
            }
            @if (showLabels) { <span>Dashboard</span> }
          </a>

          <!-- Sanctuary -->
          <a 
            routerLink="/sanctuary"
            routerLinkActive="active-sidebar-item"
            #rlaDockSanct="routerLinkActive"
            [class]="getItemClass(rlaDockSanct.isActive)"
            [class.active-item-custom]="rlaDockSanct.isActive"
            class="relative">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300" [class.icon-filled]="rlaDockSanct.isActive">timer</span>
            }
            @if (showLabels) { <span>Sanctuary</span> }
            
            @if (tareaService.isPomodoroActivo()) {
              <span class="absolute flex h-2 w-2" [ngClass]="showLabels ? 'top-3 right-4' : 'top-1 right-1'">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            }
          </a>

          @if (!isTasksStyle) {
            <div class="h-px bg-md-sys-outline/20 mx-2 my-2 shrink-0" [class.hidden]="hideDividers"></div>
          }

          <!-- Focus Intentions -->
          <button type="button" [class]="getItemClass(false)">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">task_alt</span>
            }
            @if (showLabels) { <span>Intentions</span> }
          </button>

          <!-- Analytics -->
          <button type="button" [class]="getItemClass(false)">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">analytics</span>
            }
            @if (showLabels) { <span>Analytics</span> }
          </button>

          <!-- Soundscapes -->
          <button type="button" [class]="getItemClass(false)">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">graphic_eq</span>
            }
            @if (showLabels) { <span>Soundscapes</span> }
          </button>

          <!-- Weekly Review -->
          <button type="button" [class]="getItemClass(false)">
            @if (!hideIcons) {
              <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300">event_note</span>
            }
            @if (showLabels) { <span>Review</span> }
          </button>
        </nav>

        <!-- Footer / Options -->
        <div [class]="footerClass">
          <button 
            type="button"
            (click)="toggleOptionsMenu()"
            [class]="getItemClass(isOptionsOpen)">
            <div class="flex items-center gap-3">
              @if (!hideIcons) {
                <span class="material-symbols-rounded text-xl group-hover:scale-110 transition-transform duration-300" [class.icon-filled]="isOptionsOpen">category</span>
              }
              @if (showLabels) { <span>Opciones</span> }
            </div>
            @if (showLabels) {
              <span class="material-symbols-rounded text-sm transition-transform duration-300" [class.rotate-180]="isOptionsOpen">expand_more</span>
            }
          </button>

          <!-- Options Popover -->
          @if (isOptionsOpen && !isAppearanceOpen) {
            <div class="absolute bottom-[4.5rem] left-4 bg-md-sys-surface-container-high rounded-3xl p-3 shadow-2xl border border-md-sys-outline/20 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 origin-bottom-left" [class.w-64]="showLabels" [class.w-56]="!showLabels">
              <div class="px-3 py-2 mb-1">
                <span class="text-lg font-semibold text-md-sys-on-surface border-2 border-md-sys-outline/30 rounded px-1">Opciones</span>
              </div>
              
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">add</span>
                Crear transferencia
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">view_column</span>
                Campos adicionales
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">settings</span>
                Configuración
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">refresh</span>
                Recargar App
              </button>
              <button (click)="openAppearance()" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">palette</span>
                Apariencia
              </button>
              <button class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <span class="material-symbols-rounded text-[18px]">feedback</span>
                Dar Feedback
              </button>
              <button (click)="logout()" class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-error-container hover:text-md-sys-error rounded-xl transition-colors mt-1">
                <span class="material-symbols-rounded text-[18px]">logout</span>
                Cerrar Sesión
              </button>
            </div>
          }

          <!-- Appearance Sub-Popover -->
          @if (isOptionsOpen && isAppearanceOpen) {
            <div class="absolute bottom-[4.5rem] left-4 w-72 bg-md-sys-surface-container-high rounded-3xl p-4 shadow-2xl border border-md-sys-outline/20 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 zoom-in-95 origin-bottom-left">
              <div class="flex items-center gap-2">
                <button (click)="closeAppearance()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-md-sys-surface-container-highest text-md-sys-on-surface-variant">
                  <span class="material-symbols-rounded text-[20px]">arrow_back</span>
                </button>
                <span class="text-base font-semibold text-md-sys-on-surface flex items-center gap-2">
                  <span class="material-symbols-rounded text-[18px]">palette</span>
                  Apariencia
                </span>
              </div>

              <!-- Modo Oscuro -->
              <button 
                (click)="layoutService.toggleDarkMode()"
                class="flex items-center justify-between w-full px-3 py-2 -mx-1 text-sm font-medium text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface rounded-xl transition-colors">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-rounded text-[18px]">
                    {{ layoutService.isDarkMode() ? 'dark_mode' : 'light_mode' }}
                  </span>
                  <span>Modo oscuro</span>
                </div>
                <div 
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                  [class.bg-emerald-500]="layoutService.isDarkMode()"
                  [class.bg-md-sys-surface-variant]="!layoutService.isDarkMode()">
                  <span 
                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm"
                    [class.translate-x-4]="layoutService.isDarkMode()"
                    [class.translate-x-1]="!layoutService.isDarkMode()">
                  </span>
                </div>
              </button>

              <div class="h-px w-full bg-md-sys-outline/20"></div>

              <!-- Colors Grid -->
              <div class="grid grid-cols-5 gap-3">
                @for (color of colors; track color.id) {
                  <button 
                    (click)="layoutService.setThemeColor(color.id)"
                    class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                    [class.border-white]="layoutService.themeColor() === color.id"
                    [class.border-transparent]="layoutService.themeColor() !== color.id"
                    [class.scale-110]="layoutService.themeColor() === color.id"
                    [style.background]="color.bg">
                  </button>
                }
              </div>

              <div class="h-px w-full bg-md-sys-outline/20"></div>

              <!-- Navigation Style Grid -->
              <div class="flex flex-col gap-2">
                <span class="text-[11px] text-md-sys-on-surface-variant uppercase tracking-wider font-medium">Navegación</span>
                <div class="grid grid-cols-3 gap-2">
                  @for (style of navStyles; track style) {
                    <button 
                      (click)="layoutService.setNavigationStyle(style)"
                      class="py-2 px-1 text-xs font-medium rounded-xl transition-colors text-center"
                      [class.bg-orange-500]="layoutService.navigationStyle() === style"
                      [class.text-white]="layoutService.navigationStyle() === style"
                      [class.bg-md-sys-surface-container-highest]="layoutService.navigationStyle() !== style"
                      [class.text-md-sys-on-surface-variant]="layoutService.navigationStyle() !== style"
                      [class.hover:text-md-sys-on-surface]="layoutService.navigationStyle() !== style">
                      {{ style }}
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      </aside>
    }
  `,
  styles: [`
    .active-item-custom.bg-primary-solid {
      background: var(--md-sys-color-primary, #f97316); /* using orange from the image roughly */
      color: var(--md-sys-color-on-primary, #ffffff);
    }
  `]
})
export class LayoutSidebarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  public tareaService = inject(TareaEnfoqueService);
  public layoutService = inject(LayoutService);

  isOptionsOpen = false;
  isAppearanceOpen = false;

  colors: { id: any, bg: string }[] = [
    { id: 'gray', bg: 'linear-gradient(135deg, #e5e7eb, #9ca3af)' },
    { id: 'black', bg: 'linear-gradient(135deg, #374151, #111827)' },
    { id: 'red', bg: 'linear-gradient(135deg, #f87171, #ef4444)' },
    { id: 'orange', bg: 'linear-gradient(135deg, #fbbf24, #f97316)' },
    { id: 'green', bg: 'linear-gradient(135deg, #34d399, #10b981)' },
    { id: 'blue', bg: 'linear-gradient(135deg, #60a5fa, #3b82f6)' },
    { id: 'indigo', bg: 'linear-gradient(135deg, #818cf8, #6366f1)' },
    { id: 'purple', bg: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
    { id: 'fuchsia', bg: 'linear-gradient(135deg, #e879f9, #d946ef)' },
    { id: 'pink', bg: 'linear-gradient(135deg, #f472b6, #ec4899)' },
  ];

  navStyles: NavigationStyle[] = ['Clásica', 'Bonita', 'Dock', 'Guapa', 'Tasks', 'Melon', 'Tunnel'];

  get isTasksStyle(): boolean {
    return this.layoutService.navigationStyle() === 'Tasks';
  }

  get hideIcons(): boolean {
    const style = this.layoutService.navigationStyle();
    return style === 'Tunnel' || style === 'Bonita';
  }

  get hideDividers(): boolean {
    return this.layoutService.navigationStyle() === 'Bonita';
  }

  get showLabels(): boolean {
    return this.layoutService.navigationStyle() !== 'Tasks';
  }

  get sidebarContainerClass(): string {
    const style = this.layoutService.navigationStyle();
    const base = "fixed left-0 top-0 h-screen flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-50 ";
    switch (style) {
      case 'Tasks':
        return base + "w-24 bg-transparent py-4 px-2";
      case 'Bonita':
        return base + "w-64 bg-transparent py-4 px-4";
      case 'Guapa':
      case 'Melon':
      case 'Tunnel':
        return base + "w-64 bg-transparent py-4";
      case 'Clásica':
      default:
        return base + "w-64 bg-md-sys-surface/85 backdrop-blur-xl border-r border-md-sys-outline/40 shadow-xl shadow-md-sys-shadow/10";
    }
  }

  get headerClass(): string {
    const style = this.layoutService.navigationStyle();
    
    // Hide header entirely in Bonita
    if (style === 'Bonita') {
      return 'hidden';
    }

    const base = "flex items-center shrink-0 transition-all duration-300 ";
    switch (style) {
      case 'Tasks':
        return base + "h-16 justify-center w-full";
      case 'Guapa':
        return base + "h-20 px-4";
      default:
        return base + "h-20 px-6 border-b border-md-sys-outline/20";
    }
  }

  get navContainerClass(): string {
    const style = this.layoutService.navigationStyle();
    let base = "flex-1 overflow-y-auto flex flex-col transition-all duration-300 ";
    
    if (style === 'Guapa' || style === 'Tasks') {
      base += "scrollbar-none ";
    } else {
      base += "scrollbar-thin ";
    }

    switch (style) {
      case 'Bonita':
        return base + "py-4 gap-3 justify-center";
      case 'Tasks':
        return base + "py-6 gap-4 items-center";
      case 'Guapa':
        return base + "py-4 gap-1 px-4";
      case 'Melon':
        return base + "py-4 gap-1 px-4";
      case 'Tunnel':
        return base + "py-4 gap-2 px-6";
      default:
        return base + "py-4 gap-2 px-3";
    }
  }

  get footerClass(): string {
    const style = this.layoutService.navigationStyle();
    const base = "relative transition-all duration-300 ";
    switch (style) {
      case 'Tasks':
        return base + "flex justify-center p-0 pb-4";
      case 'Bonita':
      case 'Guapa':
        return base + "px-0";
      default:
        return base + "p-4 border-t border-md-sys-outline/20";
    }
  }

  getItemClass(isActive: boolean): string {
    const style = this.layoutService.navigationStyle();
    const base = "group flex items-center transition-all duration-300 cursor-pointer font-medium ";
    
    let shapeAndLayout = "";
    let activeState = "";
    let inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container ";

    switch (style) {
      case 'Tasks':
        shapeAndLayout = "justify-center w-12 h-12 rounded-2xl text-sm ";
        activeState = "bg-primary-solid shadow-md "; // We use a custom solid color class for tasks based on user image
        inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface bg-md-sys-surface-container-low hover:bg-md-sys-surface-container-high shadow-sm ";
        break;
      case 'Bonita':
        shapeAndLayout = "px-5 py-2.5 rounded-full w-fit text-sm justify-center ";
        activeState = "bg-md-sys-surface-container-highest text-md-sys-on-surface shadow-sm ";
        inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface bg-md-sys-surface-container-low hover:bg-md-sys-surface-container ";
        break;
      case 'Guapa':
        shapeAndLayout = "gap-3 px-4 py-3 rounded-2xl w-full text-sm ";
        activeState = "text-md-sys-primary font-bold "; // No background for active in guapa
        inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-low ";
        break;
      case 'Melon':
        shapeAndLayout = "gap-3 px-4 py-3 rounded-xl w-full text-sm ";
        activeState = "bg-md-sys-surface-container-high text-md-sys-primary font-bold shadow-sm ";
        inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-low ";
        break;
      case 'Tunnel':
        shapeAndLayout = "gap-3 py-2 w-full justify-start text-base ";
        activeState = "text-md-sys-primary font-bold ";
        inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface ";
        break;
      case 'Clásica':
      default:
        shapeAndLayout = "gap-3 px-4 py-3 rounded-2xl w-full text-sm ";
        activeState = "bg-md-sys-secondary-container text-md-sys-on-secondary-container ";
        break;
    }

    if (isActive) {
      return base + shapeAndLayout + activeState;
    } else {
      return base + shapeAndLayout + inactiveState;
    }
  }

  toggleOptionsMenu() {
    this.isOptionsOpen = !this.isOptionsOpen;
    if (!this.isOptionsOpen) {
      this.isAppearanceOpen = false;
    }
  }

  openAppearance() {
    this.isAppearanceOpen = true;
  }

  closeAppearance() {
    this.isAppearanceOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
