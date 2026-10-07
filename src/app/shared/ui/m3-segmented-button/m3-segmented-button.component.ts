import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Segmented Button Component
 * Specs: https://m3.material.io/components/segmented-buttons/specs
 * 
 * Container:
 * - Height: 40dp
 * - Border: Outline color, fully rounded (corner-full)
 */
@Component({
  selector: 'm3-segmented-button',
  standalone: true,
  template: `
    <div class="inline-flex h-[40px] rounded-md-sys-corner-full border border-md-sys-outline overflow-hidden">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3SegmentedButtonComponent {}

/**
 * M3 Segmented Button Segment
 */
@Component({
  selector: 'm3-segmented-button-segment',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      (click)="onClick()"
      class="relative flex items-center justify-center h-full px-3 m3-label-large border-r last:border-r-0 border-md-sys-outline outline-none group disabled:opacity-38 disabled:pointer-events-none transition-colors duration-200"
      [class.bg-md-sys-secondary-container]="selected()"
      [class.text-md-sys-on-secondary-container]="selected()"
      [class.bg-transparent]="!selected()"
      [class.text-md-sys-on-surface]="!selected()">
      
      <!-- State Layer -->
      <div class="absolute inset-0 opacity-0 transition-opacity"
           [class.group-hover:bg-md-sys-on-secondary-container]="selected()"
           [class.group-active:bg-md-sys-on-secondary-container]="selected()"
           [class.peer-focus-visible:bg-md-sys-on-secondary-container]="selected()"
           [class.group-hover:bg-md-sys-on-surface]="!selected()"
           [class.group-active:bg-md-sys-on-surface]="!selected()"
           [class.peer-focus-visible:bg-md-sys-on-surface]="!selected()"
           [class.group-hover:opacity-8]="true"
           [class.group-active:opacity-12]="true"
           [class.peer-focus-visible:opacity-12]="true">
      </div>

      <!-- Checked Icon Container (Animating) -->
      @if (selected()) {
        <span class="material-symbols-rounded text-[18px] mr-2 animate-in fade-in zoom-in-95 duration-200">
          check
        </span>
      }

      <!-- Icon -->
      @if (icon() && !selected()) {
        <span class="material-symbols-rounded text-[18px] mr-2">
          {{ icon() }}
        </span>
      }

      <!-- Label -->
      <span class="z-10"><ng-content></ng-content></span>
      
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3SegmentedButtonSegmentComponent {
  icon = input<string>('');
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  segmentClick = output<void>();

  protected onClick(): void {
    if (!this.disabled()) {
      this.segmentClick.emit();
    }
  }
}
