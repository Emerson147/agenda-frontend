import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { TareaEnfoqueService } from '../core/services/tarea-enfoque.service';
import { LayoutSidebarComponent } from './components/layout-sidebar/layout-sidebar.component';
import { LayoutService } from '../core/services/layout.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, LayoutSidebarComponent],
  templateUrl: './main-layout.component.html',
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
  public layoutService = inject(LayoutService);

  isSettingsOpen = signal<boolean>(false);
  isDarkMode = signal<boolean>(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSettings() {
    this.isSettingsOpen.update(v => !v);
  }

  toggleDarkMode() {
    if (typeof document === 'undefined') return;

    const performToggle = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      this.isDarkMode.set(isDark);
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(performToggle);
    } else {
      performToggle();
    }
  }
}
