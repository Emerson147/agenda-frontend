import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

export type M3DividerOrientation = 'horizontal' | 'vertical';

/**
 * Material Design 3 (M3) Divider Component
 * Specifications: https://m3.material.io/components/divider/specs
 *
 * Specs:
 * - Thickness: 1dp
 * - Color: --md-sys-color-outline-variant
 * - Inset variants: full-width, middle-inset (left 16dp), list-inset (left 16dp + right 16dp)
 */
@Component({
  selector: 'm3-divider',
  standalone: true,
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    role: 'separator',
    '[attr.aria-orientation]': 'orientation()',
  },
})
export class M3DividerComponent {
  /** Orientation of the divider */
  orientation = input<M3DividerOrientation>('horizontal');

  /**
   * Inset variant:
   * - 'none': full width (default)
   * - 'inset': 16dp leading inset
   * - 'middle': 16dp both sides
   */
  inset = input<'none' | 'inset' | 'middle'>('none');

  protected hostClasses = computed(() => {
    const isHorizontal = this.orientation() === 'horizontal';

    const insetClasses: Record<string, string> = {
      none: 'w-full',
      inset: isHorizontal ? 'ml-4 w-auto' : 'mt-4',
      middle: isHorizontal ? 'mx-4 w-auto' : 'my-4',
    };

    const base = isHorizontal
      ? 'block h-px bg-md-sys-outline-variant shrink-0'
      : 'block w-px h-full bg-md-sys-outline-variant shrink-0 self-stretch';

    return `${base} ${insetClasses[this.inset()]}`.trim();
  });
}
