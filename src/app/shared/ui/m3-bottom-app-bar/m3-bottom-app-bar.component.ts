import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Bottom App Bar Component
 * Specs: https://m3.material.io/components/bottom-app-bar/specs
 * 
 * Container:
 * - Color: surface-container
 * - Elevation: level 2
 * - Height: 80dp
 */
@Component({
  selector: 'm3-bottom-app-bar',
  standalone: true,
  template: `
    <div class="flex items-center justify-between w-full h-[80px] px-4 bg-md-sys-surface-container text-md-sys-on-surface shadow-md-sys-elevation-2">
      
      <!-- Leading actions (Navigation or simple actions) -->
      <div class="flex items-center gap-2">
        <ng-content select="[m3-bottom-app-bar-leading]"></ng-content>
      </div>

      <!-- Trailing action (Usually a FAB) -->
      <div class="flex items-center">
        <ng-content select="[m3-bottom-app-bar-trailing]"></ng-content>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3BottomAppBarComponent {}
