import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Time Picker Component Scaffold
 * Specs: https://m3.material.io/components/time-pickers/specs
 * 
 * Container: 
 * - Surface container high
 * - Elevation 3
 * - Shape: corner-extra-large (28dp)
 */
@Component({
  selector: 'm3-time-picker',
  standalone: true,
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/32" (click)="onBackdropClick()">
        
        <div class="bg-md-sys-surface-container-high text-md-sys-on-surface rounded-md-sys-corner-extra-large shadow-md-sys-elevation-3 flex flex-col w-full max-w-[328px] overflow-hidden p-6" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="m3-label-medium text-md-sys-on-surface-variant mb-5">
            Select time
          </div>

          <!-- Time Input Area (Scaffold) -->
          <div class="flex items-center justify-center gap-2 mb-6">
            <!-- Hour -->
            <div class="bg-md-sys-primary-container text-md-sys-on-primary-container rounded-md-sys-corner-medium flex items-center justify-center w-24 h-20 m3-display-large">
              12
            </div>
            <span class="m3-display-large text-md-sys-on-surface">:</span>
            <!-- Minute -->
            <div class="bg-md-sys-surface-container-highest text-md-sys-on-surface rounded-md-sys-corner-medium flex items-center justify-center w-24 h-20 m3-display-large">
              00
            </div>
            <!-- AM/PM Toggle -->
            <div class="flex flex-col border border-md-sys-outline rounded-md-sys-corner-medium overflow-hidden ml-2">
              <button class="px-3 py-2 bg-md-sys-tertiary-container text-md-sys-on-tertiary-container m3-label-large">AM</button>
              <div class="h-px bg-md-sys-outline"></div>
              <button class="px-3 py-2 bg-transparent text-md-sys-on-surface m3-label-large">PM</button>
            </div>
          </div>

          <!-- Clock Dial Area (Scaffold) -->
          <div class="flex justify-center mb-6">
            <div class="w-[256px] h-[256px] rounded-full bg-md-sys-surface-container-highest flex items-center justify-center text-md-sys-on-surface-variant">
              Clock UI here
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2">
            <ng-content select="[m3-time-actions]"></ng-content>
          </div>

        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3TimePickerComponent {
  open = input<boolean>(false);
  closed = output<void>();

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
