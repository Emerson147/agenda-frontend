import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Material Design 3 (M3) Bottom Sheet Component
 * Specs: https://m3.material.io/components/bottom-sheets/specs
 * 
 * Standard Bottom Sheet:
 * - Container: surface-container-low
 * - Elevation: level 1
 * - Shape: corner-extra-large (28dp) on top corners
 * - Scrim (backdrop): black 32%
 */
@Component({
  selector: 'm3-bottom-sheet',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (open()) {
      <!-- Scrim (Backdrop) -->
      <div
        class="fixed inset-0 z-40 bg-black/32 transition-opacity duration-200 animate-in fade-in"
        aria-hidden="true"
        (click)="onBackdropClick()">
      </div>

      <!-- Bottom Sheet Container -->
      <div
        role="dialog"
        aria-modal="true"
        class="fixed bottom-0 left-0 right-0 z-50 flex flex-col w-full max-w-[640px] mx-auto bg-md-sys-surface-container-low text-md-sys-on-surface rounded-t-md-sys-corner-extra-large shadow-md-sys-elevation-1 animate-in slide-in-from-bottom duration-300 ease-md-sys-emphasized-decelerate">
        
        <!-- Drag Handle (Visual only for now) -->
        <div class="flex justify-center pt-4 pb-2">
          <div class="w-8 h-1 bg-md-sys-on-surface-variant/40 rounded-full"></div>
        </div>

        <!-- Content Area -->
        <div class="px-4 pb-4 overflow-y-auto max-h-[80vh]">
          <ng-content></ng-content>
        </div>

      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3BottomSheetComponent {
  /** Controls visibility */
  open = input<boolean>(false);

  /** Emits when backdrop is clicked */
  closed = output<void>();

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
