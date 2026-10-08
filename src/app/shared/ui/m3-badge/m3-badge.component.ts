import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Badge Component
 * Specifications: https://m3.material.io/components/badges/specs
 *
 * M3 defines exactly two physical sizes:
 * - No label: 6x6dp dot — presence indicator only
 * - With label: min-width 16dp, height 16dp — shows number or text (up to max+)
 *
 * Specs:
 * - Color: error / on-error
 * - Corner: full
 * - Label: Label Small (11sp)
 */
@Component({
  selector: 'm3-badge',
  standalone: true,
  template: `
    @if (hasLabel()) {
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

  /** Maximum number before showing "max+" truncation. Default: 999 */
  max = input<number>(999);

  /** Custom aria-label */
  ariaLabel = input<string>('');

  protected hasLabel = computed(() => !!this.label());

  protected displayLabel = computed(() => {
    const val = this.label();
    if (!val) return '';
    const num = typeof val === 'number' ? val : parseInt(String(val), 10);
    if (!isNaN(num) && num > this.max()) {
      return `${this.max()}+`;
    }
    return String(val);
  });

  protected hostClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center',
      'bg-md-sys-error text-md-sys-on-error',
      'rounded-md-sys-corner-full',
      'select-none',
    ];

    if (!this.hasLabel()) {
      // Dot badge: 6x6dp, no text
      base.push('w-1.5 h-1.5');
    } else {
      // Large badge: min-width 16dp, height 16dp, with label text
      base.push('min-w-[16px] h-4 px-1 text-[11px] font-medium');
    }

    return base.join(' ');
  });
}

