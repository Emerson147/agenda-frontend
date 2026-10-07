import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Date Picker Component Scaffold
 * Specs: https://m3.material.io/components/date-pickers/specs
 * 
 * Container: 
 * - Surface container high
 * - Elevation 3
 * - Shape: corner-extra-large (28dp)
 */
@Component({
  selector: 'm3-date-picker',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/32" (click)="onBackdropClick()">
        
        <div class="bg-md-sys-surface-container-high text-md-sys-on-surface rounded-md-sys-corner-extra-large shadow-md-sys-elevation-3 flex flex-col w-full max-w-[328px] overflow-hidden" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="flex flex-col px-6 pt-4 pb-2">
            <span class="m3-label-medium text-md-sys-on-surface-variant mb-4">Select date</span>
            <div class="flex items-center justify-between">
              <span class="m3-headline-large">{{ selectedDate() | date:'MMM d, y' }}</span>
              <button class="material-symbols-rounded text-md-sys-on-surface-variant hover:bg-md-sys-on-surface-variant/8 p-2 rounded-full transition-colors">edit</button>
            </div>
          </div>

          <!-- Divider -->
          <div class="w-full h-px bg-md-sys-surface-variant"></div>

          <!-- Calendar Area (Scaffold) -->
          <div class="p-4 flex-1 min-h-[250px] flex items-center justify-center text-md-sys-on-surface-variant">
            <ng-content></ng-content>
            @if (!hasContent) {
              <span>Calendar logic goes here</span>
            }
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2 p-2">
            <ng-content select="[m3-date-actions]"></ng-content>
          </div>

        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3DatePickerComponent {
  open = input<boolean>(false);
  selectedDate = input<Date>(new Date());
  closed = output<void>();

  hasContent = false; // Mock, checking via @ContentChild usually

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
