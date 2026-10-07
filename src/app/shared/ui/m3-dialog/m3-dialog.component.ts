import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { M3DividerComponent } from '../m3-divider/m3-divider.component';

/**
 * Material Design 3 (M3) Dialog Component
 * Specifications: https://m3.material.io/components/dialogs/specs
 *
 * Specs:
 * - Basic Dialog: corner-extra-large (28dp)
 * - Container color: surface-container-high
 * - Elevation: level 3
 * - Scrim (backdrop): black 32%
 * - Padding: 24dp all around
 */
@Component({
  selector: 'm3-dialog',
  standalone: true,
  imports: [CommonModule, M3DividerComponent],
  template: `
    @if (open()) {
      <!-- Scrim (Backdrop) -->
      <div
        class="fixed inset-0 z-50 bg-black/32 transition-opacity duration-200 animate-in fade-in"
        aria-hidden="true"
        (click)="onBackdropClick()">
      </div>

      <!-- Dialog Container -->
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="headline() ? dialogId + '-title' : null"
          class="pointer-events-auto bg-md-sys-surface-container-high text-md-sys-on-surface rounded-md-sys-corner-extra-large shadow-md-sys-elevation-3 flex flex-col overflow-hidden min-w-[280px] max-w-[560px] animate-in fade-in zoom-in-95 duration-200"
          [class.w-full]="fullscreen()">
          
          <!-- Icon -->
          @if (icon()) {
            <div class="pt-6 pb-4 flex justify-center text-md-sys-secondary">
              <span class="material-symbols-rounded text-[24px]">{{ icon() }}</span>
            </div>
          }

          <!-- Headline -->
          @if (headline()) {
            <div
              [id]="dialogId + '-title'"
              class="px-6 pb-4 m3-headline-small text-center"
              [class.pt-6]="!icon()">
              {{ headline() }}
            </div>
          }

          <!-- Content Scrollable Area -->
          <div class="px-6 m3-body-medium text-md-sys-on-surface-variant overflow-y-auto"
               [class.pt-6]="!headline() && !icon()"
               [class.pb-6]="!hasActions">
            <ng-content />
          </div>

          <!-- Divider (optional, if content scrolls, but we keep it simple here) -->
          
          <!-- Actions -->
          @if (hasActions) {
            <div class="px-6 pb-6 pt-6 flex flex-wrap justify-end gap-2">
              <ng-content select="[m3-dialog-actions]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3DialogComponent {
  /** Whether the dialog is open */
  open = input<boolean>(false);

  /** Dialog headline (title) */
  headline = input<string>('');

  /** Optional icon at the top center */
  icon = input<string>('');

  /** If true, makes the dialog stretch to full width on mobile */
  fullscreen = input<boolean>(false);

  /** Emits when the user clicks the backdrop (to close) */
  closed = output<void>();

  /** Whether the dialog has custom actions projected */
  hasActions = true; // In a full implementation, you'd use @ContentChild to detect

  protected dialogId = `m3-dialog-${Math.random().toString(36).slice(2, 7)}`;

  protected onBackdropClick(): void {
    this.closed.emit();
  }
}
