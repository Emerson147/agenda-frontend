import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Radio Button Component
 * Specifications: https://m3.material.io/components/radio-button/specs
 *
 * Specs:
 * - Outer ring: 20dp diameter, 2dp stroke, corner-full
 * - Inner dot (selected): 10dp diameter
 * - Touch target: 48x48dp
 * - State layer: 40dp circle on hover/press
 *
 * Usage: wrap multiple m3-radio inside a role="radiogroup" container.
 * Use the same [name] to group them semantically.
 */
@Component({
  selector: 'm3-radio',
  standalone: true,
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer select-none group">
      <!-- Hidden native input -->
      <input
        type="radio"
        class="sr-only"
        [value]="value()"
        [name]="name()"
        [checked]="checked()"
        [disabled]="disabled()"
        [attr.aria-label]="label() || ariaLabel()"
        (change)="onSelect()"
        (blur)="onBlur()"
      />

      <!-- Visual radio with 40dp state-layer target -->
      <span class="relative inline-flex items-center justify-center w-10 h-10 shrink-0">
        <!-- State layer -->
        <span [class]="stateLayerClasses()"></span>

        <!-- Outer ring -->
        <span [class]="ringClasses()">
          <!-- Inner dot -->
          <span [class]="dotClasses()"></span>
        </span>
      </span>

      @if (label()) {
        <span class="m3-body-large text-md-sys-on-surface"
              [class.opacity-38]="disabled()">
          {{ label() }}
        </span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
})
export class M3RadioComponent {
  /** The value this radio represents */
  value = input<string>('');

  /** Radio group name — same across siblings */
  name = input<string>('m3-radio-group');

  /** Whether this radio is currently selected */
  checked = input<boolean>(false);

  /** Whether this radio is disabled */
  disabled = input<boolean>(false);

  /** Optional visible label */
  label = input<string>('');

  /** Accessible label when no visible label */
  ariaLabel = input<string>('');

  /** Emits this radio's value when selected */
  selected = output<string>();

  protected ringClasses = computed(() => {
    const on = this.checked();
    return [
      'inline-flex items-center justify-center',
      'w-5 h-5 rounded-md-sys-corner-full',
      'border-2 transition-all duration-150 ease-md-sys-standard',
      on
        ? 'border-md-sys-primary'
        : 'border-md-sys-on-surface-variant',
      this.disabled() ? 'opacity-38' : '',
    ].join(' ');
  });

  protected dotClasses = computed(() => {
    const on = this.checked();
    return [
      'rounded-md-sys-corner-full',
      'bg-md-sys-primary',
      'transition-all duration-150 ease-md-sys-emphasized',
      on ? 'w-2.5 h-2.5 opacity-100' : 'w-0 h-0 opacity-0',
    ].join(' ');
  });

  protected stateLayerClasses = computed(() => {
    const on = this.checked();
    return [
      'absolute inset-0 rounded-md-sys-corner-full opacity-0',
      'transition-opacity duration-150',
      'group-hover:opacity-100',
      on ? 'bg-md-sys-primary/8' : 'bg-md-sys-on-surface/8',
    ].join(' ');
  });

  protected onSelect(): void {
    if (this.disabled()) return;
    this.selected.emit(this.value());
  }

  protected onBlur(): void {}
}
