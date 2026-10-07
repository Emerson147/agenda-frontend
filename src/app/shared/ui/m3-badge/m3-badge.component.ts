import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type M3BadgeSize = 'dot' | 'small' | 'large';

/**
 * Material Design 3 (M3) Badge Component
 * Specifications: https://m3.material.io/components/badges/specs
 *
 * Sizes:
 * - 'dot':   6x6dp – no label, just presence indicator
 * - 'small': 6x6dp – 1–9 (numbers ≤9)
 * - 'large': 16dp height – numbers > 9 (up to 999+)
 *
 * Specs:
 * - Color: error-container by default (customizable)
 * - Corner: full
 * - Label: Label Small (11sp)
 */
@Component({
  selector: 'm3-badge',
  standalone: true,
  template: `
    @if (label()) {
      <span class="m3-label-small leading-none">{{ displayLabel() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.aria-label]': 'ariaLabel() || (label() ? label() + " notifications" : null)',
    role: 'status',
  },
})
export class M3BadgeComponent {
  /** Number or text to display. Leave empty for dot badge. */
  label = input<string | number>('');

  /** Maximum number before showing "999+" truncation. Default: 999 */
  max = input<number>(999);

  /** Custom aria-label */
  ariaLabel = input<string>('');

  protected displayLabel = computed(() => {
    const val = this.label();
    if (!val) return '';
    const num = typeof val === 'number' ? val : parseInt(String(val), 10);
    if (!isNaN(num) && num > this.max()) {
      return `${this.max()}+`;
    }
    return String(val);
  });

  protected badgeSize = computed<M3BadgeSize>(() => {
    const val = this.label();
    if (!val) return 'dot';
    const num = typeof val === 'number' ? val : parseInt(String(val), 10);
    if (!isNaN(num) && num > 9) return 'large';
    if (val) return 'small';
    return 'dot';
  });

  protected hostClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center',
      'bg-md-sys-error text-md-sys-on-error',
      'rounded-md-sys-corner-full',
      'select-none',
    ];

    const size = this.badgeSize();

    if (size === 'dot') {
      base.push('w-1.5 h-1.5');
    } else if (size === 'small') {
      base.push('w-4 h-4 text-[11px] font-medium');
    } else {
      // large
      base.push('min-w-[16px] h-4 px-1 text-[11px] font-medium');
    }

    return base.join(' ');
  });
}
