import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'pill' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'button[ui-button], a[ui-button], ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <span class="material-symbols-rounded animate-spin text-[18px]">progress_activity</span>
    }
    <ng-content></ng-content>
  `,
  host: {
    '[class]': 'hostClasses()',
    '[attr.disabled]': '(disabled() || loading()) ? true : null',
    '[attr.aria-disabled]': 'disabled() || loading()',
    '(click)': 'handleClick($event)'
  }
})
export class UiButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  disabled = input<boolean>(false);
  loading = input<boolean>(false);

  btnClick = output<MouseEvent>();

  protected hostClasses = computed(() => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-zen-accent text-white hover:bg-stone-800 shadow-sm border border-transparent',
      secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200/80',
      ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-transparent',
      pill: 'rounded-full border border-stone-200/60 bg-white/70 hover:bg-white text-stone-700 shadow-xs',
      icon: 'rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 border border-transparent'
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-6 py-3 rounded-lg',
      icon: 'w-10 h-10 p-0 rounded-full flex items-center justify-center'
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });

  protected handleClick(event: MouseEvent) {
    if (this.disabled() || this.loading()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.btnClick.emit(event);
  }
}
