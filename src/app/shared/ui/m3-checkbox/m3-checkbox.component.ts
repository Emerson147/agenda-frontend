import {
  Component,
  input,
  output,
  computed,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Material Design 3 (M3) Checkbox Component
 * Specifications: https://m3.material.io/components/checkbox/specs
 *
 * Specs:
 * - Container: 18x18dp, corner-extra-small (2dp)
 * - Touch target: 48x48dp
 * - States: unchecked, checked (primary fill), indeterminate
 * - State layer: 40dp circle on hover/press
 * - Implements ControlValueAccessor
 */
@Component({
  selector: 'm3-checkbox',
  standalone: true,
  template: `
    <label class="inline-flex items-center gap-3 cursor-pointer select-none group">
      <!-- Hidden native input for a11y -->
      <input
        type="checkbox"
        class="sr-only"
        [checked]="resolvedChecked()"
        [indeterminate]="indeterminate()"
        [disabled]="disabled()"
        [attr.aria-label]="label() || ariaLabel()"
        (change)="onNativeChange($event)"
        (blur)="onTouched()"
      />

      <!-- Custom visual checkbox with 40dp state layer -->
      <span class="relative inline-flex items-center justify-center w-10 h-10 shrink-0">
        <!-- State layer -->
        <span [class]="stateLayerClasses()"></span>

        <!-- Box -->
        <span [class]="boxClasses()">
          @if (resolvedChecked() && !indeterminate()) {
            <span class="material-symbols-rounded text-[14px] leading-none text-md-sys-on-primary" aria-hidden="true">
              check
            </span>
          }
          @if (indeterminate()) {
            <span class="material-symbols-rounded text-[14px] leading-none text-md-sys-on-primary" aria-hidden="true">
              remove
            </span>
          }
        </span>
      </span>

      @if (label()) {
        <span class="m3-body-large text-md-sys-on-surface" [class.text-md-sys-on-surface-variant]="disabled()">
          {{ label() }}
        </span>
      }
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-block',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => M3CheckboxComponent),
      multi: true,
    },
  ],
})
export class M3CheckboxComponent implements ControlValueAccessor {
  /** Current checked state */
  checked = input<boolean>(false);

  /** Indeterminate state (shows dash instead of checkmark) */
  indeterminate = input<boolean>(false);

  /** Whether the checkbox is disabled */
  disabled = input<boolean>(false);

  /** Optional label rendered beside the checkbox */
  label = input<string>('');

  /** Accessible label when no visible label */
  ariaLabel = input<string>('');

  /** Emits new checked state */
  checkedChange = output<boolean>();

  private _internalChecked = signal<boolean>(false);
  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  protected resolvedChecked = computed(() => this._internalChecked());

  protected boxClasses = computed(() => {
    const on = this.resolvedChecked() || this.indeterminate();
    return [
      'relative inline-flex items-center justify-center',
      'w-[18px] h-[18px] rounded-[2px]',
      'transition-all duration-150 ease-md-sys-standard',
      on
        ? 'bg-md-sys-primary border-2 border-md-sys-primary'
        : 'bg-transparent border-2 border-md-sys-on-surface-variant',
      this.disabled() && !on ? 'border-md-sys-on-surface/38' : '',
      this.disabled() && on ? 'bg-md-sys-on-surface/38 border-md-sys-on-surface/38' : '',
    ].join(' ');
  });

  protected stateLayerClasses = computed(() => {
    const on = this.resolvedChecked();
    return [
      'absolute inset-0 rounded-md-sys-corner-full opacity-0',
      'transition-opacity duration-150',
      'group-hover:opacity-100',
      on ? 'bg-md-sys-primary/8' : 'bg-md-sys-on-surface/8',
    ].join(' ');
  });

  protected onNativeChange(event: Event): void {
    const el = event.target as HTMLInputElement;
    this._internalChecked.set(el.checked);
    this._onChange(el.checked);
    this.checkedChange.emit(el.checked);
  }

  protected onTouched(): void {
    this._onTouched();
  }

  // ControlValueAccessor
  writeValue(val: boolean): void {
    this._internalChecked.set(!!val);
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this._onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(): void {}
}
