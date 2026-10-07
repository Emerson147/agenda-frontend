import {
  Component,
  input,
  model,
  computed,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

export type M3TextFieldVariant = 'filled' | 'outlined';

/**
 * Material Design 3 (M3) Text Field Component
 * Specifications: https://m3.material.io/components/text-fields/specs
 *
 * Variants:
 * - 'filled': Surface container bg with bottom border indicator.
 * - 'outlined': Transparent bg with full surrounding border.
 *
 * Specs:
 * - Height: 56dp
 * - Corner: extra-small (4dp) for filled, small (4dp) for outlined
 * - Label: Body Large (floating), then Body Small (active)
 * - Leading/trailing icon: 24dp
 * - Implements ControlValueAccessor for Angular forms
 */
@Component({
  selector: 'm3-text-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="relative" [class]="containerClasses()">
      <!-- Leading icon -->
      @if (leadingIcon()) {
        <span
          class="material-symbols-rounded text-[24px] text-md-sys-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true">
          {{ leadingIcon() }}
        </span>
      }

      <!-- Input -->
      <input
        [id]="inputId()"
        [type]="type()"
        [placeholder]="isFocused() || hasValue() ? '' : ' '"
        [value]="value()"
        [disabled]="effectiveDisabled()"
        [class]="inputClasses()"
        [attr.aria-label]="label()"
        [attr.aria-describedby]="supportingText() ? inputId() + '-hint' : null"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />

      <!-- Floating label -->
      @if (label()) {
        <label
          [for]="inputId()"
          [class]="labelClasses()">
          {{ label() }}
        </label>
      }

      <!-- Trailing icon -->
      @if (trailingIcon()) {
        <span
          class="material-symbols-rounded text-[24px] text-md-sys-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          aria-hidden="true">
          {{ trailingIcon() }}
        </span>
      }

      <!-- Filled variant: bottom indicator line -->
      @if (variant() === 'filled') {
        <div
          [class]="indicatorClasses()"
          aria-hidden="true">
        </div>
      }
    </div>

    <!-- Supporting text / error message -->
    @if (errorText() || supportingText()) {
      <p
        [id]="inputId() + '-hint'"
        [class]="supportingClasses()">
        @if (errorIcon() && errorText()) {
          <span class="material-symbols-rounded text-[16px] leading-none shrink-0">error</span>
        }
        {{ errorText() || supportingText() }}
      </p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => M3TextFieldComponent),
      multi: true,
    },
  ],
})
export class M3TextFieldComponent implements ControlValueAccessor {
  /** Visual variant */
  variant = input<M3TextFieldVariant>('filled');

  /** Floating label text */
  label = input<string>('');

  /** Input type (text, email, password, number, etc.) */
  type = input<string>('text');

  /** Leading icon (Material Symbols name) */
  leadingIcon = input<string>('');

  /** Trailing icon (Material Symbols name) */
  trailingIcon = input<string>('');

  /** Supporting text below field */
  supportingText = input<string>('');

  /** Error message (shows instead of supportingText, turns field red) */
  errorText = input<string>('');

  /** Show error icon alongside error text */
  errorIcon = input<boolean>(true);

  /** Accessible ID for the input (auto-generated if not set) */
  inputId = input<string>(`m3-field-${Math.random().toString(36).slice(2, 7)}`);

  /** Whether the field is disabled */
  disabled = input<boolean>(false);

  // Internal state
  protected value = signal<string>('');
  protected isFocused = signal<boolean>(false);
  protected cvaDisabled = signal<boolean>(false);

  protected effectiveDisabled = computed(() => this.disabled() || this.cvaDisabled());

  protected hasValue = computed(() => this.value().length > 0);
  protected hasError = computed(() => !!this.errorText());
  protected isFloating = computed(() => this.isFocused() || this.hasValue());

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};

  // --- Computed classes ---

  protected containerClasses = computed(() => {
    const base = 'w-full relative';

    if (this.variant() === 'filled') {
      return [
        base,
        'flex items-center',
        'h-14',
        'bg-md-sys-surface-container-highest',
        'rounded-t-md-sys-corner-xs rounded-b-none',
        this.hasError() ? 'bg-md-sys-error/8' : '',
      ].join(' ');
    }

    // outlined
    return [
      base,
      'flex items-center',
      'h-14',
      'bg-transparent',
      'rounded-md-sys-corner-xs',
      'border',
      this.isFocused()
        ? (this.hasError() ? 'border-2 border-md-sys-error' : 'border-2 border-md-sys-primary')
        : (this.hasError() ? 'border border-md-sys-error' : 'border border-md-sys-outline'),
      'transition-all duration-150',
    ].join(' ');
  });

  protected inputClasses = computed(() => {
    const leadingPad = this.leadingIcon() ? 'pl-[52px]' : 'pl-4';
    const trailingPad = this.trailingIcon() ? 'pr-[52px]' : 'pr-4';
    const hasLabel = !!this.label();

    return [
      'w-full h-full bg-transparent outline-none border-none',
      'm3-body-large text-md-sys-on-surface',
      leadingPad,
      trailingPad,
      // Shift text down when label floats above
      hasLabel ? (this.isFloating() ? 'pt-4 pb-2' : 'py-0') : 'py-0',
      'placeholder:text-md-sys-on-surface-variant',
      'disabled:pointer-events-none disabled:text-md-sys-on-surface/38',
      'caret-md-sys-primary',
    ].join(' ');
  });

  protected labelClasses = computed(() => {
    const leadingOffset = this.leadingIcon() ? 'left-[52px]' : 'left-4';
    const floating = this.isFloating();
    const error = this.hasError();
    const focused = this.isFocused();

    const color = error
      ? 'text-md-sys-error'
      : focused
        ? 'text-md-sys-primary'
        : 'text-md-sys-on-surface-variant';

    return [
      'absolute pointer-events-none select-none',
      leadingOffset,
      'transition-all duration-150 ease-md-sys-standard',
      color,
      // Floating: move to top in Body Small size
      floating
        ? 'm3-body-small top-2'
        : 'm3-body-large top-1/2 -translate-y-1/2',
    ].join(' ');
  });

  protected indicatorClasses = computed(() => {
    const error = this.hasError();
    const focused = this.isFocused();

    return [
      'absolute bottom-0 left-0 right-0',
      'transition-all duration-150',
      focused || error ? 'h-[2px]' : 'h-px',
      error
        ? 'bg-md-sys-error'
        : focused
          ? 'bg-md-sys-primary'
          : 'bg-md-sys-on-surface-variant',
    ].join(' ');
  });

  protected supportingClasses = computed(() => {
    return [
      'flex items-center gap-1 mt-1 px-4',
      'm3-body-small',
      this.hasError() ? 'text-md-sys-error' : 'text-md-sys-on-surface-variant',
    ].join(' ');
  });

  // --- Event handlers ---

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this._onChange(val);
  }

  protected onFocus(): void {
    this.isFocused.set(true);
  }

  protected onBlur(): void {
    this.isFocused.set(false);
    this._onTouched();
  }

  // --- ControlValueAccessor ---

  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }
}
