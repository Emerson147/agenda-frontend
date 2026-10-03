import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type M3ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion';

/**
 * Material Design 3 (M3) Chip Component
 * Specifications: https://m3.material.io/components/chips/specs
 * 
 * Supports:
 * - 'assist': Informational metrics and guidance.
 * - 'filter': Selected/unselected state toggling.
 * - 'input': User data entries.
 * - 'suggestion': Proactive actions.
 * - Leading icon integration via Material Symbols Rounded.
 * - Exact 32px M3 specification height and capsule geometry.
 */
@Component({
  selector: 'm3-chip, [m3-chip], button[m3-chip]',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (icon()) {
      <span 
        class="material-symbols-rounded text-[18px] shrink-0"
        [class.icon-filled]="iconFilled()"
        [class.text-md-sys-tertiary]="iconColor() === 'tertiary'"
        [class.text-amber-600]="iconColor() === 'amber'"
        [class.text-md-sys-on-surface-variant]="!iconColor() || iconColor() === 'muted'">
        {{ icon() }}
      </span>
    }
    <span class="m3-label-small font-medium tracking-tight">
      <ng-content></ng-content>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(click)': 'handleClick($event)'
  }
})
export class M3ChipComponent {
  variant = input<M3ChipVariant>('assist');
  selected = input<boolean>(false);
  clickable = input<boolean>(false);
  icon = input<string | null>(null);
  iconFilled = input<boolean>(false);
  iconColor = input<'tertiary' | 'amber' | 'muted' | null>(null);

  chipClick = output<MouseEvent>();

  protected hostClasses = computed(() => {
    const base = 'inline-flex items-center gap-2 h-8 px-3.5 rounded-md-sys-corner-full transition-all ease-md-sys-emphasized duration-200 select-none';

    let variantStyle = '';
    if (this.variant() === 'filter' && this.selected()) {
      variantStyle = 'bg-md-sys-surface-container-high text-md-sys-on-surface font-semibold shadow-xs border border-md-sys-outline-variant';
    } else if (this.variant() === 'assist') {
      variantStyle = 'bg-md-sys-surface-container-lowest text-md-sys-on-surface border-0';
    } else {
      variantStyle = 'bg-md-sys-surface-container text-md-sys-on-surface-variant border border-transparent';
    }

    const interactiveStyle = this.clickable()
      ? 'cursor-pointer hover:bg-md-sys-surface-container-high active:scale-95'
      : '';

    return `${base} ${variantStyle} ${interactiveStyle}`.trim();
  });

  protected handleClick(event: MouseEvent) {
    if (this.clickable()) {
      this.chipClick.emit(event);
    }
  }
}
