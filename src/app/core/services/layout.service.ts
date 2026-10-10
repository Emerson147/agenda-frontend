import { Injectable, signal } from '@angular/core';

export type NavigationStyle = 'Clásica' | 'Bonita' | 'Dock' | 'Guapa' | 'Tasks' | 'Melon' | 'Tunnel';
export type ThemeColor = 'gray' | 'black' | 'red' | 'orange' | 'green' | 'blue' | 'indigo' | 'purple' | 'fuchsia' | 'pink';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  navigationStyle = signal<NavigationStyle>('Dock');
  themeColor = signal<ThemeColor>('blue');
  isDarkMode = signal<boolean>(typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  toggleDarkMode() {
    if (typeof document === 'undefined') return;

    const performToggle = () => {
      const isDark = document.documentElement.classList.toggle('dark');
      this.isDarkMode.set(isDark);
    };

    if ('startViewTransition' in document) {
      document.documentElement.classList.add('theme-transitioning');
      const transition = (document as any).startViewTransition(performToggle);
      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-transitioning');
      });
    } else {
      performToggle();
    }
  }

  setDarkMode(isDark: boolean) {
    if (typeof document === 'undefined') return;
    if (this.isDarkMode() === isDark) return;

    const performToggle = () => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      this.isDarkMode.set(isDark);
    };

    if ('startViewTransition' in document) {
      document.documentElement.classList.add('theme-transitioning');
      const transition = (document as any).startViewTransition(performToggle);
      transition.finished.finally(() => {
        document.documentElement.classList.remove('theme-transitioning');
      });
    } else {
      performToggle();
    }
  }

  setNavigationStyle(style: NavigationStyle) {
    this.navigationStyle.set(style);
  }

  setThemeColor(color: ThemeColor) {
    this.themeColor.set(color);
  }
}
