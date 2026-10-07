import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type M3FabSize = 'small' | 'medium' | 'large';
export type M3FabColor = 'primary' | 'secondary' | 'tertiary' | 'surface';

/**
 * Material Design 3 (M3) Floating Action Button
 * Specifications: https://m3.material.io/components/floating-action-button/specs
 *
 * Sizes:
 * - 'small':  40x40dp,  corner-md (12dp)
 * - 'medium': 56x56dp,  corner-lg (16dp) ← default FAB
 * - 'large':  96x96dp,  corner-xl (28dp)
 *
 * Colors:
 * - 'primary':   primary-container bg
 * - 'secondary': secondary-container bg
 * - 'tertiary':  tertiary-container bg
 * - 'surface':   surface-container-high bg (lowest contrast)
 *
 * Extended FAB: set [label] to show text + icon side by side.
 */
@Component({
  selector: 'button[m3-fab], a[m3-fab]',
  standalone: true,
  template: `
    <span
      class="material-symbols-rounded leading-none shrink-0 transition-transform duration-200"
      [class]="iconSizeClass()">
      <ng-content />
    </span>
    @if (label()) {
      <span class="m3-label-large whitespace-nowrap">{{ label() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled() ? true : null',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-label]': 'ariaLabel()',
    '(click)': 'handleClick($event)',
  },
})
export class M3FabComponent {
  /** FAB size */
  size = input<M3FabSize>('medium');

  /** Color role */
  color = input<M3FabColor>('primary');

  /**
   * When provided, renders an Extended FAB (icon + label).
   * Width becomes flexible (min-w auto).
   */
  label = input<string>('');

  /** Accessible label for icon-only FABs */
  ariaLabel = input<string>('');

  /** Whether the FAB is disabled */
  disabled = input<boolean>(false);

  /** Click event emitter */
  fabClick = output<MouseEvent>();

  protected iconSizeClass = computed(() => {
    const sizes: Record<M3FabSize, string> = {
      small: 'text-[24px]',
      medium: 'text-[24px]',
      large: 'text-[36px]',
    };
    return sizes[this.size()];
  });

  protected hostClasses = computed(() => {
    const isExtended = !!this.label();

    // Container sizes per spec
    const sizeClasses: Record<M3FabSize, string> = {
      small: 'w-10 h-10 rounded-md-sys-corner-md',
      medium: isExtended
        ? 'h-14 px-4 rounded-md-sys-corner-lg min-w-[80px]'
        : 'w-14 h-14 rounded-md-sys-corner-lg',
      large: 'w-24 h-24 rounded-md-sys-corner-xl',
    };

    // Color roles per spec
    const colorClasses: Record<M3FabColor, string> = {
      primary:
        'bg-md-sys-primary-container text-md-sys-on-primary-container hover:shadow-md-sys-elevation-2 active:shadow-md-sys-elevation-1',
      secondary:
        'bg-md-sys-secondary-container text-md-sys-on-secondary-container hover:shadow-md-sys-elevation-2 active:shadow-md-sys-elevation-1',
      tertiary:
        'bg-md-sys-tertiary-container text-md-sys-on-tertiary-container hover:shadow-md-sys-elevation-2 active:shadow-md-sys-elevation-1',
      surface:
        'bg-md-sys-surface-container-high text-md-sys-primary hover:shadow-md-sys-elevation-2 active:shadow-md-sys-elevation-1',
    };

    const base = [
      'inline-flex items-center justify-center gap-3',
      'shadow-md-sys-elevation-3',
      'transition-all duration-200 ease-md-sys-emphasized',
      'cursor-pointer select-none outline-none',
      'hover:brightness-95 active:brightness-90',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-md-sys-primary/60',
      'disabled:pointer-events-none disabled:opacity-38',
    ].join(' ');

    return `${base} ${sizeClasses[this.size()]} ${colorClasses[this.color()]}`.trim();
  });

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.fabClick.emit(event);
  }
}
