import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TareaEnfoqueService } from '../../../core/services/tarea-enfoque.service';
import { LayoutService, NavigationStyle, ThemeColor } from '../../../core/services/layout.service';
import { M3MenuComponent, M3MenuItemComponent } from '../../../shared/ui/m3-menu/m3-menu.component';
import { M3DividerComponent } from '../../../shared/ui/m3-divider/m3-divider.component';

export interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly path?: string;
  readonly exact?: boolean;
  readonly isSanctuary?: boolean;
}

@Component({
  selector: 'app-layout-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    M3MenuComponent,
    M3MenuItemComponent,
    M3DividerComponent,
  ],
  templateUrl: './layout-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutSidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public readonly tareaService = inject(TareaEnfoqueService);
  public readonly layoutService = inject(LayoutService);

  readonly isOptionsOpen = signal(false);
  readonly isAppearanceOpen = signal(false);

  readonly navItems: ReadonlyArray<NavItem> = [
    { path: '/', icon: 'home', label: 'Dashboard', exact: true },
    { path: '/sanctuary', icon: 'timer', label: 'Sanctuary', isSanctuary: true },
    { icon: 'task_alt', label: 'Focus Intentions' },
    { icon: 'analytics', label: 'Metrics & Insights' },
    { icon: 'graphic_eq', label: 'Soundscapes' },
    { icon: 'event_note', label: 'Weekly Review' },
  ];

  readonly colors: ReadonlyArray<{ id: ThemeColor; bg: string }> = [
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

  readonly navStyles: ReadonlyArray<NavigationStyle> = ['Clásica', 'Bonita', 'Dock', 'Guapa', 'Tasks', 'Melon', 'Tunnel'];

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
    const base = "fixed left-0 top-0 h-screen flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] z-50 ";
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

    const base = "flex items-center shrink-0 transition-all duration-(--duration-md-sys-medium-1) ";
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
    let base = "flex-1 overflow-y-auto overflow-x-hidden flex flex-col transition-all duration-(--duration-md-sys-medium-1) ";

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
    const base = "relative transition-all duration-(--duration-md-sys-medium-1) ";
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

  getDockItemClass(isActive: boolean): string {
    return isActive
      ? 'w-20 bg-md-sys-primary text-md-sys-on-primary'
      : 'w-12 hover:w-16 text-md-sys-on-surface-variant hover:bg-md-sys-surface-container-highest hover:text-md-sys-on-surface';
  }

  getItemClass(isActive: boolean): string {
    const style = this.layoutService.navigationStyle();
    const base = "group flex items-center transition-all duration-(--duration-md-sys-medium-1) ease-(--ease-md-sys-emphasized) active:scale-95 cursor-pointer font-medium ";

    let shapeAndLayout = "";
    let activeState = "";
    let inactiveState = "text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container ";

    switch (style) {
      case 'Tasks':
        shapeAndLayout = "justify-center h-12 rounded-2xl text-sm ";
        activeState = "bg-md-sys-primary text-md-sys-on-primary shadow-md w-16 ";
        inactiveState = "w-12 hover:w-16 text-md-sys-on-surface-variant hover:text-md-sys-on-surface bg-md-sys-surface-container-low hover:bg-md-sys-surface-container-high shadow-sm ";
        break;
      case 'Bonita':
        shapeAndLayout = "py-2.5 rounded-full w-fit text-sm justify-center ";
        activeState = "bg-md-sys-surface-container-highest text-md-sys-on-surface shadow-sm px-8 ";
        inactiveState = "px-5 hover:px-8 text-md-sys-on-surface-variant hover:text-md-sys-on-surface bg-md-sys-surface-container-low hover:bg-md-sys-surface-container ";
        break;
      case 'Guapa':
        shapeAndLayout = "gap-3 py-3 rounded-2xl w-full text-sm ";
        activeState = "text-md-sys-primary font-bold px-6 ";
        inactiveState = "px-4 hover:px-6 text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-low ";
        break;
      case 'Melon':
        shapeAndLayout = "gap-3 py-3 rounded-xl w-full text-sm ";
        activeState = "bg-md-sys-surface-container-high text-md-sys-primary font-bold shadow-sm px-6 ";
        inactiveState = "px-4 hover:px-6 text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-low ";
        break;
      case 'Tunnel':
        shapeAndLayout = "gap-3 py-2 w-full justify-start text-base ";
        activeState = "text-md-sys-primary font-bold px-4 ";
        inactiveState = "px-2 hover:px-4 text-md-sys-on-surface-variant hover:text-md-sys-on-surface ";
        break;
      case 'Clásica':
      default:
        shapeAndLayout = "gap-3 py-3 rounded-2xl w-full text-sm ";
        activeState = "bg-md-sys-secondary-container text-md-sys-on-secondary-container px-6 ";
        inactiveState = "px-4 hover:px-6 text-md-sys-on-surface-variant hover:text-md-sys-on-surface hover:bg-md-sys-surface-container-low ";
        break;
    }

    if (isActive) {
      return base + shapeAndLayout + activeState;
    } else {
      return base + shapeAndLayout + inactiveState;
    }
  }

  toggleOptionsMenu(): void {
    this.isOptionsOpen.update((open) => !open);
    if (!this.isOptionsOpen()) {
      this.isAppearanceOpen.set(false);
    }
  }

  openAppearance(): void {
    this.isAppearanceOpen.set(true);
  }

  closeAppearance(): void {
    this.isAppearanceOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
