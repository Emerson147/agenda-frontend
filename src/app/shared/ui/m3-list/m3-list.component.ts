import {
  Component,
  input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'm3-list',
  standalone: true,
  template: `
    <ul class="flex flex-col w-full py-2 m-0 p-0 list-none bg-md-sys-surface text-md-sys-on-surface">
      <ng-content></ng-content>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3ListComponent {}

/**
 * Material Design 3 (M3) List Item Component
 * Specifications: https://m3.material.io/components/lists/specs
 *
 * Specs:
 * - 1-line: 56dp height
 * - 2-line: 72dp height
 * - 3-line: 88dp height
 * - Background: surface
 * - Headline: body-large
 * - Supporting text: body-medium
 */
@Component({
  selector: 'm3-list-item',
  standalone: true,
  template: `
    <li
      class="relative flex items-center justify-between w-full px-4 min-h-14 bg-md-sys-surface hover:bg-md-sys-on-surface/8 transition-colors cursor-pointer group"
      [class.min-h-[72px]]="supportingText()"
      [class.min-h-[88px]]="multiLineSupportingText()">
      
      <div class="flex items-center gap-4 flex-1 overflow-hidden">
        
        <!-- Leading Icon / Avatar -->
        @if (leadingIcon()) {
          <span class="material-symbols-rounded text-[24px] text-md-sys-on-surface-variant shrink-0">
            {{ leadingIcon() }}
          </span>
        }

        <!-- Text Content -->
        <div class="flex flex-col flex-1 overflow-hidden justify-center py-2">
          <!-- Headline -->
          <span class="m3-body-large text-md-sys-on-surface truncate">
            <ng-content></ng-content>
          </span>
          
          <!-- Supporting Text -->
          @if (supportingText()) {
            <span 
              class="m3-body-medium text-md-sys-on-surface-variant"
              [class.truncate]="!multiLineSupportingText()"
              [class.line-clamp-2]="multiLineSupportingText()">
              {{ supportingText() }}
            </span>
          }
        </div>
      </div>

      <!-- Trailing content -->
      <div class="flex items-center gap-4 ml-4 shrink-0">
        <ng-content select="[m3-list-trailing]"></ng-content>
      </div>

      <!-- State layer -->
      <span class="absolute inset-0 opacity-0 group-active:bg-md-sys-on-surface/12 pointer-events-none transition-opacity"></span>
    </li>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3ListItemComponent {
  /** Leading icon material symbol name */
  leadingIcon = input<string>('');

  /** Supporting text displayed below the headline */
  supportingText = input<string>('');

  /** If true, supporting text wraps to up to 2 lines, increasing height to 88dp */
  multiLineSupportingText = input<boolean>(false);
}
