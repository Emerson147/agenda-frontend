import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Material Design 3 (M3) Linear Progress Indicator
 * Specifications: https://m3.material.io/components/progress-indicators/specs
 * 
 * Supports:
 * - Deterministic progress percentage (0 - 100%)
 * - Indeterminate animated loading state
 * - Full capsule corner geometry
 * - Emphasized motion deceleration curve
 */
@Component({
  selector: 'm3-linear-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="h-full rounded-md-sys-corner-full bg-md-sys-primary transition-all duration-500 ease-md-sys-emphasized"
      [class.animate-pulse]="indeterminate()"
      [style.width.%]="clampedValue()">
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    'class': 'block w-full h-2 rounded-md-sys-corner-full bg-md-sys-surface-container-highest overflow-hidden'
  }
})
export class M3LinearProgressComponent {
  /**
   * Progress value between 0 and 100
   */
  value = input<number>(0);

  /**
   * Whether the progress is in an indeterminate continuous state
   */
  indeterminate = input<boolean>(false);

  protected clampedValue = computed(() => {
    if (this.indeterminate()) return 100;
    return Math.min(100, Math.max(0, this.value()));
  });
}
