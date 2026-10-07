import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Navigation Rail Component
 * Specs: https://m3.material.io/components/navigation-rail/specs
 * 
 * Container:
 * - Color: surface
 * - Width: 80dp
 */
@Component({
  selector: 'm3-navigation-rail',
  standalone: true,
  template: `
    <nav class="flex flex-col items-center w-[80px] h-full py-4 bg-md-sys-surface text-md-sys-on-surface">
      
      <!-- Top Section (FAB or Menu icon usually goes here) -->
      <div class="mb-8 flex flex-col items-center">
        <ng-content select="[m3-rail-top]"></ng-content>
      </div>

      <!-- Center Section (Destinations) -->
      <div class="flex flex-col items-center gap-3 flex-1 overflow-y-auto hide-scrollbar w-full">
        <ng-content></ng-content>
      </div>

      <!-- Bottom Section -->
      <div class="mt-auto flex flex-col items-center">
        <ng-content select="[m3-rail-bottom]"></ng-content>
      </div>
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationRailComponent {}

/**
 * M3 Navigation Rail Item
 */
@Component({
  selector: 'm3-navigation-rail-item',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="onClick()"
      class="relative flex flex-col items-center justify-center w-full min-h-[56px] outline-none group disabled:opacity-38 disabled:pointer-events-none">
      
      <!-- Active Pill / Icon Container -->
      <div class="relative flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-200"
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
      @if (label()) {
        <span class="mt-1 m3-label-medium transition-colors duration-200"
              [class.text-md-sys-on-surface]="selected()"
              [class.text-md-sys-on-surface-variant]="!selected()">
          {{ label() }}
        </span>
      }
    </button>
  `,
  styles: [`
    .fill-icon { font-variation-settings: 'FILL' 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationRailItemComponent {
  label = input<string>('');
  icon = input<string>('');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  itemClick = output<void>();

  protected onClick(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }
}
