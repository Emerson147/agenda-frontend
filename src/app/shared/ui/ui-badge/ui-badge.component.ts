import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'zen' | 'outline' | 'subtle';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium tracking-wider uppercase transition-colors"
      [class.bg-stone-100]="variant() === 'zen'"
      [class.border-stone-200]="variant() === 'zen'"
      [class.text-stone-600]="variant() === 'zen'"
      [class.border-stone-300]="variant() === 'outline'"
      [class.text-stone-500]="variant() === 'outline'"
    >
      @if (dot()) {
        <span
          class="w-1.5 h-1.5 rounded-full bg-zen-accent"
          [class.animate-pulse]="pulse()"
        ></span>
      }
      <ng-content></ng-content>
    </div>
  `
})
export class UiBadgeComponent {
  variant = input<BadgeVariant>('zen');
  dot = input<boolean>(true);
  pulse = input<boolean>(false);
}
