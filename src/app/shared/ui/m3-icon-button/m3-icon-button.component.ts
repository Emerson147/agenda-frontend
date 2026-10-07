import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type M3IconButtonVariant =
  | 'standard'
  | 'filled'
  | 'tonal'
  | 'outlined';

/**
 * Material Design 3 (M3) Icon Button Component
 * Specifications: https://m3.material.io/components/icon-buttons/specs
 *
 * Variants:
 * - 'standard': No container, icon only.
 * - 'filled': Filled primary container, highest emphasis.
 * - 'tonal': Secondary container, medium-high emphasis.
 * - 'outlined': Outline border, no fill, medium emphasis.
 *
 * Specs:
 * - Container: 40x40dp
 * - Corner: full
 * - Icon: 24dp
 * - Toggle: selected state changes color/fill
 */
@Component({
  selector: 'button[m3-icon-button], a[m3-icon-button]',
  standalone: true,
  template: `
    <span class="material-symbols-rounded text-[24px] leading-none transition-all duration-150">
      <ng-content />
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': 'disabled() ? true : null',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.aria-pressed]': 'toggle() ? selected() : null',
    '(click)': 'handleClick($event)',
  },
})
export class M3IconButtonComponent {
  /** Visual variant */
  variant = input<M3IconButtonVariant>('standard');

  /** Whether the button is disabled */
  disabled = input<boolean>(false);

  /**
   * When true, the button behaves as a toggle.
   * Use with [selected] to control active state.
   */
  toggle = input<boolean>(false);

  /** Current selected state (only relevant when toggle=true) */
  selected = input<boolean>(false);

  /** Emits the new selected state when toggled */
  selectedChange = output<boolean>();

  /** Click event emitter */
  btnClick = output<MouseEvent>();

  protected hostClasses = computed(() => {
    const base = [
      'inline-flex items-center justify-center',
      'w-10 h-10 rounded-md-sys-corner-full',
      'transition-all duration-200 ease-md-sys-standard',
      'cursor-pointer select-none outline-none',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-md-sys-primary/60',
      'disabled:pointer-events-none disabled:opacity-38',
    ].join(' ');

    const isSelected = this.toggle() && this.selected();

    const variantClasses: Record<M3IconButtonVariant, string> = {
      standard: isSelected
        ? 'bg-transparent text-md-sys-primary hover:bg-md-sys-primary/8 active:bg-md-sys-primary/12'
        : 'bg-transparent text-md-sys-on-surface-variant hover:bg-md-sys-on-surface-variant/8 active:bg-md-sys-on-surface-variant/12',

      filled: isSelected
        ? 'bg-md-sys-primary text-md-sys-on-primary hover:brightness-95 active:brightness-90'
        : 'bg-md-sys-surface-container-highest text-md-sys-primary hover:brightness-95 active:brightness-90',

      tonal: isSelected
        ? 'bg-md-sys-secondary-container text-md-sys-on-secondary-container hover:brightness-95 active:brightness-90'
        : 'bg-md-sys-surface-container-highest text-md-sys-on-surface-variant hover:brightness-95 active:brightness-90',

      outlined: isSelected
        ? 'bg-md-sys-inverse-surface text-md-sys-inverse-on-surface border border-md-sys-inverse-surface hover:brightness-95 active:brightness-90'
        : 'bg-transparent text-md-sys-on-surface-variant border border-md-sys-outline hover:bg-md-sys-on-surface-variant/8 active:bg-md-sys-on-surface-variant/12',
    };

    return `${base} ${variantClasses[this.variant()]}`.trim();
  });

  protected handleClick(event: MouseEvent): void {
    if (this.disabled()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.toggle()) {
      this.selectedChange.emit(!this.selected());
    }
    this.btnClick.emit(event);
  }
}
