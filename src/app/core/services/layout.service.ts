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
      (document as any).startViewTransition(performToggle);
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
