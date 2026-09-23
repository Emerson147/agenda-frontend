import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type InputVariant = 'standard' | 'zen-hero';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full flex flex-col items-center">
      <input
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [value]="value()"
        (input)="onInputChange($event)"
        (keydown.enter)="enterPressed.emit(value())"
        [class]="inputClasses()"
      />
      @if (error()) {
        <span class="text-xs text-rose-500 mt-2 font-medium tracking-wide animate-fade-in">{{ error() }}</span>
      }
    </div>
  `
})
export class UiInputComponent {
  value = model<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  type = input<string>('text');
  variant = input<InputVariant>('standard');
  error = input<string | null>(null);

  enterPressed = output<string>();

  protected inputClasses(): string {
    if (this.variant() === 'zen-hero') {
      return 'w-full max-w-[540px] text-center text-3xl font-light tracking-tight text-stone-800 placeholder:text-stone-300 bg-transparent border-b-2 border-transparent hover:border-stone-200 focus:border-stone-400 focus:outline-none transition-all duration-300 py-2 selection:bg-zen-accent/15';
    }
    return 'w-full px-3 py-2 text-sm bg-white/80 border border-stone-200 rounded-md text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400/50 transition-all';
  }

  protected onInputChange(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
  }
}
