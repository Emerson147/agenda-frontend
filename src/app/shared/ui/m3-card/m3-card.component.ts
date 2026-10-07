 import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type M3CardVariant = 'filled' | 'elevated' | 'outlined';

/**
 * Material Design 3 (M3) Card Component
 * Specifications: https://m3.material.io/components/cards/specs
 * 
 * Supports:
 * - 'filled' (Default): Pure tonal surface without borders.
 * - 'elevated': Surface with subtle M3 elevation shadow.
 * - 'outlined': Base surface with subtle outline-variant border.
 * - Shape: 28px corner-xl geometry.
 * - Interactive: Responsive state layers and emphasized motion.
 */
@Component({
  selector: 'm3-card, [m3-card], section[m3-card]',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-content></ng-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()'
  }
})
export class M3CardComponent {
  /**
   * Card visual variant: 'filled' | 'elevated' | 'outlined'
   */
  variant = input<M3CardVariant>('elevated');

  /**
   * Whether the card responds to user hover and active touch
   */
  interactive = input<boolean>(false);

  /**
   * Custom padding override: 'none' | 'sm' | 'md' | 'lg'
   */
  padding = input<'none' | 'sm' | 'md' | 'lg'>('lg');

  protected hostClasses = computed(() => {
    const base = 'block rounded-md-sys-corner-xl text-md-sys-on-surface transition-all ease-md-sys-emphasized duration-200 select-none overflow-hidden';

    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-6 sm:p-8'
    };

    const variantClasses: Record<M3CardVariant, string> = {
      filled: 'bg-md-sys-surface-container-low border-0',
      elevated: 'bg-md-sys-surface-container-low border-0 shadow-md-sys-elevation-1',
      outlined: 'bg-md-sys-surface border border-md-sys-outline-variant/70'
    };

    const interactiveClasses = this.interactive()
      ? 'cursor-pointer hover:bg-md-sys-surface-container active:scale-[0.99] active:bg-md-sys-surface-container-high'
      : '';

    return `${base} ${variantClasses[this.variant()]} ${paddingClasses[this.padding()]} ${interactiveClasses}`.trim();
  });
}
