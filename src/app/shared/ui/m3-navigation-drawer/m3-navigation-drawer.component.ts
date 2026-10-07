import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Navigation Drawer Component
 * Specs: https://m3.material.io/components/navigation-drawer/specs
 * 
 * Container:
 * - Standard/Modal Drawer Color: surface-container-low
 * - Width: 360dp
 * - Top, bottom, right corner rounding (typically extra-large 28dp)
 */
@Component({
  selector: 'm3-navigation-drawer',
  standalone: true,
  template: `
    <aside class="flex flex-col w-[360px] h-full px-3 py-4 bg-md-sys-surface-container-low text-md-sys-on-surface rounded-r-md-sys-corner-extra-large">
      
      <!-- Headline / Title area -->
      @if (headline()) {
        <div class="px-4 mb-4 m3-title-small text-md-sys-on-surface-variant">
          {{ headline() }}
        </div>
      }

      <!-- Content (List of destinations) -->
      <div class="flex flex-col gap-1 overflow-y-auto hide-scrollbar">
        <ng-content></ng-content>
      </div>

    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationDrawerComponent {
  headline = input<string>('');
}

/**
 * M3 Navigation Drawer Item
 * Active: Secondary container, shape full
 */
@Component({
  selector: 'm3-navigation-drawer-item',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="onClick()"
      class="relative flex items-center w-full h-[56px] px-4 rounded-md-sys-corner-full outline-none group disabled:opacity-38 disabled:pointer-events-none transition-colors duration-200"
      [class.bg-md-sys-secondary-container]="selected()">
      
      <!-- State Layer -->
      <div class="absolute inset-0 rounded-md-sys-corner-full opacity-0 group-hover:bg-md-sys-on-surface/8 group-active:bg-md-sys-on-surface/12 transition-opacity"></div>
      <div class="absolute inset-0 rounded-md-sys-corner-full opacity-0 peer-focus-visible:bg-md-sys-on-surface/12 transition-opacity"></div>

      <!-- Leading Icon -->
      @if (icon()) {
        <span class="material-symbols-rounded text-[24px] mr-3 z-10"
              [class.fill-icon]="selected()"
              [class.text-md-sys-on-secondary-container]="selected()"
              [class.text-md-sys-on-surface-variant]="!selected()">
          {{ icon() }}
        </span>
      }

      <!-- Label -->
      <span class="m3-label-large z-10"
            [class.text-md-sys-on-secondary-container]="selected()"
            [class.text-md-sys-on-surface]="!selected()">
        <ng-content></ng-content>
      </span>

      <!-- Badge or Trailing Element -->
      <div class="ml-auto z-10 text-md-sys-on-surface-variant">
        <ng-content select="[m3-drawer-trailing]"></ng-content>
      </div>
      
    </button>
  `,
  styles: [`
    .fill-icon { font-variation-settings: 'FILL' 1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3NavigationDrawerItemComponent {
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
