import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Material Design 3 (M3) Slider Component
 * Specifications: https://m3.material.io/components/sliders/specs
 *
 * Specs:
 * - Active track: primary, 4dp height
 * - Inactive track: surface-variant, 4dp height
 * - Handle: primary, 44x44dp touch target (visible handle 20x20dp)
 * - State layer: primary/8 (hover) or /12 (pressed), 40x40dp
 */
@Component({
  selector: 'm3-slider',
  standalone: true,
  template: `
    <div
      class="relative flex items-center w-full h-[44px] group cursor-pointer"
      [class.opacity-38]="disabled()"
      [class.pointer-events-none]="disabled()">
      
      <!-- Native range input (visually hidden but fully functional for a11y, keyboard, touch) -->
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="disabled()"
        (input)="onInput($event)"
        class="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
        [attr.aria-label]="ariaLabel()" />

      <!-- Inactive Track -->
      <div class="absolute left-0 right-0 h-1 bg-md-sys-surface-variant rounded-md-sys-corner-full overflow-hidden">
        <!-- Active Track -->
        <div
          class="absolute left-0 top-0 bottom-0 bg-md-sys-primary transition-all duration-75"
          [style.width]="progressPercentage() + '%'">
        </div>
      </div>

      <!-- Handle Container -->
      <div
        class="absolute top-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-75 pointer-events-none z-10"
        [style.left]="'calc(' + progressPercentage() + '% - 22px)'"
        style="width: 44px; height: 44px;">
        
        <!-- State layer (Hover/Focus) -->
        <div class="absolute w-10 h-10 rounded-full bg-md-sys-primary opacity-0 group-hover:opacity-8 transition-opacity"></div>
        <div class="absolute w-10 h-10 rounded-full bg-md-sys-primary opacity-0 peer-focus-visible:opacity-12 transition-opacity"></div>

        <!-- Visible Handle -->
        <div class="w-5 h-5 bg-md-sys-primary rounded-full shadow-md-sys-elevation-1"></div>
      </div>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => M3SliderComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3SliderComponent implements ControlValueAccessor {
  min = input<number>(0);
  max = input<number>(100);
  step = input<number>(1);
  disabled = input<boolean>(false);
  ariaLabel = input<string>('Slider');

  value = input<number>(0);
  change = output<number>();

  protected _value = 0;
  protected onChange: (val: number) => void = () => {};
  protected onTouched: () => void = () => {};

  protected progressPercentage = computed(() => {
    const min = this.min();
    const max = this.max();
    const val = this.value() || this._value;
    const bounded = Math.max(min, Math.min(max, val));
    return ((bounded - min) / (max - min)) * 100;
  });

  protected onInput(event: Event): void {
    const inputEle = event.target as HTMLInputElement;
    const val = parseFloat(inputEle.value);
    this._value = val;
    this.onChange(val);
    this.change.emit(val);
  }

  // CVA
  writeValue(obj: any): void {
    if (typeof obj === 'number') {
      this._value = obj;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
