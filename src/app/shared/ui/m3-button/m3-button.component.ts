import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type M3ButtonVariant =
  | 'filled'
  | 'tonal'
  | 'outlined'
  | 'text'
  | 'elevated';

/**
 * Material Design 3 (M3) Button Component
 * Specifications: https://m3.material.io/components/buttons/specs
 *
 * Variants:
 * - 'filled': Highest emphasis. Primary color container.
 * - 'tonal': Medium-high emphasis. Secondary container.
 * - 'outlined': Medium emphasis. Outline border, no fill.
 * - 'text': Low emphasis. No container.
 * - 'elevated': Low emphasis. Surface with shadow.
 *
 * Specs:
 * - Height: 40dp
 * - Corner: full (20dp)
 * - Label: Label Large (14sp, weight 500)
 * - Leading/trailing icon: 18dp
 * - Padding: 24dp horizontal (16dp with icon side)
 */
@Component({
  selector: 'button[m3-button], a[m3-button]',
  standalone: true,
  template: `
    @if (leadingIcon()) {
      <span class="material-symbols-rounded text-[18px] leading-none shrink-0">
        {{ leadingIcon() }}
      </span>
    }
    <ng-content />
    @if (trailingIcon()) {
      <span class="material-symbols-rounded text-[18px] leading-none shrink-0">
        {{ trailingIcon() }}
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': '(disabled() || loading()) ? true : null',
    '[attr.aria-disabled]': 'disabled() || loading()',
    '[attr.aria-busy]': 'loading()',
    '(click)': 'handleClick($event)',
  },
})
export class M3ButtonComponent {
  /** Visual variant */
  variant = input<M3ButtonVariant>('filled');

  /** Leading icon (Material Symbols name, e.g. 'add', 'send') */
  leadingIcon = input<string>('');

  /** Trailing icon (Material Symbols name) */
  trailingIcon = input<string>('');

  /** Whether the button is disabled */
  disabled = input<boolean>(false);

  /** Whether to show a loading state */
  loading = input<boolean>(false);

  /** Click event emitter */
  btnClick = output<MouseEvent>();

  protected hostClasses = computed(() => {
    const hasLeading = !!this.leadingIcon();
    const hasTrailing = !!this.trailingIcon();

    // M3 spec: 16dp on the icon side, 24dp on the label side
    let padding: string;
    if (hasLeading && hasTrailing) {
      padding = 'px-4';
    } else if (hasLeading) {
      padding = 'pl-4 pr-6';
    } else if (hasTrailing) {
      padding = 'pl-6 pr-4';
    } else {
      padding = 'px-6';
    }

    const base = [
      'inline-flex items-center justify-center gap-2',
      'h-10 rounded-md-sys-corner-full',
      'm3-label-large',
      'transition-all duration-200 ease-md-sys-standard',
      'cursor-pointer select-none outline-none',
      'relative overflow-hidden',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-md-sys-primary/60',
      'disabled:pointer-events-none disabled:opacity-38',
      padding,
    ].join(' ');

    const variantClasses: Record<M3ButtonVariant, string> = {
      filled:
        'bg-md-sys-primary text-md-sys-on-primary hover:shadow-md-sys-elevation-1 hover:brightness-95 active:brightness-90 active:shadow-none',
      tonal:
        'bg-md-sys-secondary-container text-md-sys-on-secondary-container hover:shadow-md-sys-elevation-1 hover:brightness-95 active:brightness-90 active:shadow-none',
      outlined:
        'bg-transparent text-md-sys-primary border border-md-sys-outline hover:bg-md-sys-primary/8 active:bg-md-sys-primary/12',
      text:
        'bg-transparent text-md-sys-primary px-3 hover:bg-md-sys-primary/8 active:bg-md-sys-primary/12',
      elevated:
        'bg-md-sys-surface-container-low text-md-sys-primary shadow-md-sys-elevation-1 hover:shadow-md-sys-elevation-2 hover:brightness-95 active:shadow-md-sys-elevation-1 active:brightness-90',
    };

    return `${base} ${variantClasses[this.variant()]}`.trim();
  });

  protected handleClick(event: Event): void {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.btnClick.emit(event as MouseEvent);
  }
}
