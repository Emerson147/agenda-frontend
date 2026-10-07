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
 * Material Design 3 (M3) Switch Component
 * Specifications: https://m3.material.io/components/switch/specs
 *
 * Specs:
 * - Track: 52x32dp, corner-full
 * - Thumb (unselected): 16dp → expands to 24dp on press
 * - Thumb (selected): 24dp → expands to 28dp on press
 * - Icon on thumb: optional, 16dp
 * - Colors: primary (selected), surface-container-highest (unselected)
 * - Implements ControlValueAccessor
 */
@Component({
  selector: 'm3-switch',
  standalone: true,
  template: `
    <button
      type="button"
      role="switch"
      [attr.aria-checked]="checked()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-disabled]="disabled()"
      [disabled]="disabled() || null"
      [class]="trackClasses()"
      (click)="toggle()"
      (keydown.space)="toggle(); $event.preventDefault()">

      <!-- Thumb -->
      <span [class]="thumbClasses()">
        @if (checkedIcon() && checked()) {
          <span class="material-symbols-rounded text-[16px] leading-none" aria-hidden="true">
            {{ checkedIcon() }}
          </span>
        } @else if (uncheckedIcon() && !checked()) {
          <span class="material-symbols-rounded text-[16px] leading-none" aria-hidden="true">
            {{ uncheckedIcon() }}
          </span>
        }
      </span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'inline-flex items-center',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => M3SwitchComponent),
      multi: true,
    },
  ],
})
export class M3SwitchComponent implements ControlValueAccessor {
  /** Current checked state (two-way bindable) */
  checked = input<boolean>(false);

  /** Whether the switch is disabled */
  disabled = input<boolean>(false);

  /** Icon shown on thumb when checked (Material Symbols name) */
  checkedIcon = input<string>('');

  /** Icon shown on thumb when unchecked (Material Symbols name) */
  uncheckedIcon = input<string>('');

  /** Accessible label */
  ariaLabel = input<string>('Toggle');

  /** Emits the new boolean state when toggled */
  checkedChange = output<boolean>();

  private _internalChecked = signal<boolean>(false);
  private _onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  private resolvedChecked = computed(() => this._internalChecked());

  protected trackClasses = computed(() => {
    const on = this.resolvedChecked();
    return [
      'relative inline-flex items-center shrink-0',
      'w-[52px] h-8 rounded-md-sys-corner-full',
      'transition-all duration-200 ease-md-sys-standard',
      'cursor-pointer outline-none',
      'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-md-sys-primary/60',
      'disabled:pointer-events-none disabled:opacity-38',
      on
        ? 'bg-md-sys-primary'
        : 'bg-md-sys-surface-container-highest border-2 border-md-sys-outline',
    ].join(' ');
  });

  protected thumbClasses = computed(() => {
    const on = this.resolvedChecked();
    return [
      'inline-flex items-center justify-center',
      'rounded-md-sys-corner-full',
      'transition-all duration-200 ease-md-sys-emphasized',
      'shadow-md-sys-elevation-1',
      on
        ? 'w-6 h-6 translate-x-[22px] bg-md-sys-on-primary text-md-sys-on-primary-container'
        : 'w-4 h-4 translate-x-[4px] bg-md-sys-outline text-md-sys-surface-container-highest',
    ].join(' ');
  });

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.resolvedChecked();
    this._internalChecked.set(next);
    this._onChange(next);
    this._onTouched();
    this.checkedChange.emit(next);
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
