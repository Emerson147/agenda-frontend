import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Menu Component
 * Specs: https://m3.material.io/components/menus/specs
 * 
 * Container:
 * - Color: surface-container
 * - Elevation: level 2
 * - Shape: corner-extra-small (4dp)
 * - Padding: 8dp top and bottom
 */
@Component({
  selector: 'm3-menu',
  standalone: true,
  host: {
    class: 'block'
  },
  template: `
  <div class="flex flex-col py-2 bg-md-sys-surface-container text-md-sys-on-surface rounded-md-sys-corner-xl border border-md-sys-outline/20 shadow-2xl overflow-hidden min-w-28 max-w-70">
    <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3MenuComponent { }

/**
 * M3 Menu Item Component
 */
@Component({
  selector: 'm3-menu-item',
  standalone: true,
  host: {
    class: 'block w-full'
  },
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="onClick()"
      class="relative flex items-center justify-between w-full h-12 px-3 outline-none group disabled:opacity-38 disabled:pointer-events-none cursor-pointer bg-transparent">
      
      <!-- State Layer -->
      <div class="absolute inset-0 opacity-0 group-hover:bg-md-sys-on-surface/8 group-active:bg-md-sys-on-surface/12 transition-opacity"></div>

      <!-- Leading section (Icon + Text) -->
      <div class="flex items-center z-10">
        @if (leadingIcon()) {
          <span class="material-symbols-rounded text-[24px] text-md-sys-on-surface-variant mr-3">
            {{ leadingIcon() }}
          </span>
        }
        <span class="m3-label-large text-md-sys-on-surface">
          <ng-content></ng-content>
        </span>
      </div>

      <!-- Trailing section (Icon or text like shortcuts) -->
      @if (trailingIcon() || trailingText()) {
        <div class="flex items-center ml-4 z-10 text-md-sys-on-surface-variant">
          @if (trailingText()) {
            <span class="m3-label-medium mr-2">{{ trailingText() }}</span>
          }
          @if (trailingIcon()) {
            <span class="material-symbols-rounded text-[24px]">{{ trailingIcon() }}</span>
          }
        </div>
      }
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3MenuItemComponent {
  leadingIcon = input<string>('');
  trailingIcon = input<string>('');
  trailingText = input<string>('');
  disabled = input<boolean>(false);
  itemClick = output<void>();

  protected onClick(): void {
    if (!this.disabled()) {
      this.itemClick.emit();
    }
  }
}
