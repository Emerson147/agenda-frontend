import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Navigation Bar Component
 * Specs: https://m3.material.io/components/navigation-bar/specs
 * 
 * Container:
 * - Color: surface-container
 * - Height: 80dp
 * - Elevation: level 2 (typically visual only, flat with surface)
 */
@Component({
  selector: 'm3-navigation-bar',
  standalone: true,
  template: `
    <nav class="flex items-center justify-between w-full h-[80px] px-2 bg-md-sys-surface-container text-md-sys-on-surface">
      <ng-content></ng-content>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationBarComponent {}

/**
 * M3 Navigation Bar Item (Tab)
 */
@Component({
  selector: 'm3-navigation-tab',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="onClick()"
      class="relative flex flex-col items-center justify-center flex-1 h-full min-w-[48px] max-w-[80px] outline-none group disabled:opacity-38 disabled:pointer-events-none">
      
      <!-- Active Pill / Icon Container -->
      <div class="relative flex items-center justify-center w-16 h-8 rounded-full transition-colors duration-200"
           [class.bg-md-sys-secondary-container]="selected()"
           [class.text-md-sys-on-secondary-container]="selected()"
           [class.text-md-sys-on-surface-variant]="!selected()">
        
        <!-- State Layer -->
        <div class="absolute inset-0 rounded-full opacity-0 group-hover:bg-md-sys-on-surface/8 group-active:bg-md-sys-on-surface/12 transition-opacity"></div>
        <div class="absolute inset-0 rounded-full opacity-0 peer-focus-visible:bg-md-sys-on-surface/12 transition-opacity"></div>

        <!-- Icon -->
        <span class="material-symbols-rounded text-[24px] z-10" [class.fill-icon]="selected()">
          {{ icon() }}
        </span>
      </div>

      <!-- Label -->
      <span class="mt-1 m3-label-medium transition-colors duration-200"
            [class.text-md-sys-on-surface]="selected()"
            [class.text-md-sys-on-surface-variant]="!selected()">
        {{ label() }}
      </span>
    </button>
  `,
  styles: [`
    .fill-icon { font-variation-settings: 'FILL' 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationTabComponent {
  label = input<string>('');
  icon = input<string>('');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  tabClick = output<void>();

  protected onClick(): void {
    if (!this.disabled()) {
      this.tabClick.emit();
    }
  }
}
