import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Material Design 3 (M3) Circular Progress Indicator Component
 * Specifications: https://m3.material.io/components/progress-indicators/specs
 *
 * Specs:
 * - Active Indicator: primary
 * - Track (optional): secondary container or surface container highest
 */
@Component({
  selector: 'm3-circular-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      role="progressbar"
      [attr.aria-valuenow]="indeterminate() ? null : value()"
      aria-valuemin="0"
      aria-valuemax="100"
      [class]="containerClasses()"
      [style.width.px]="size()"
      [style.height.px]="size()">

      <!-- SVG rotates for indeterminate; static -rotate-90 for determinate start position -->
      <svg
        class="w-full h-full"
        viewBox="22 22 44 44"
        [class.-rotate-90]="!indeterminate()"
        [class.animate-spin]="indeterminate()">

        <!-- Background Track -->
        <circle
          class="text-md-sys-surface-container-highest"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke-width="3.6"
          stroke="currentColor">
        </circle>

        <!-- Active Indicator -->
        <circle
          class="text-md-sys-primary transition-all duration-300 ease-md-sys-standard"
          [style.stroke-dasharray]="indeterminate() ? '80, 200' : '126.92'"
          [style.stroke-dashoffset]="dashOffset()"
          cx="44"
          cy="44"
          r="20.2"
          fill="none"
          stroke-width="3.6"
          stroke="currentColor"
          stroke-linecap="round">
        </circle>
      </svg>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3CircularProgressComponent {
  /** True for continuous animation, false for manual progress */
  indeterminate = input<boolean>(true);

  /** Progress percentage (0 to 100), only used if indeterminate is false */
  value = input<number>(0);

  /** Size of the spinner, defaults to 48px */
  size = input<number>(48);

  protected containerClasses = computed(() => {
    return 'inline-flex items-center justify-center';
  });

  protected dashOffset = computed(() => {
    if (this.indeterminate()) {
      return '0';
    }
    // Circumference = 2 * PI * 20.2 ≈ 126.92
    const circumference = 126.92;
    const progress = Math.min(Math.max(this.value(), 0), 100);
    return `${circumference - (progress / 100) * circumference}`;
  });
}
