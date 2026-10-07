import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type M3TabVariant = 'primary' | 'secondary';

@Component({
  selector: 'm3-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Tab list container -->
    <div
      role="tablist"
      class="flex flex-row relative"
      [class]="containerClasses()">
      
      <!-- Container divider (for secondary tabs) -->
      @if (variant() === 'secondary') {
        <div class="absolute bottom-0 left-0 right-0 h-px bg-md-sys-surface-variant"></div>
      }

      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto overflow-y-hidden hide-scrollbar',
  },
})
export class M3TabsComponent {
  /** 'primary' (with floating indicator) or 'secondary' (with full-width divider) */
  variant = input<M3TabVariant>('primary');

  protected containerClasses = computed(() => {
    return this.variant() === 'primary' ? 'h-12' : 'h-12'; // Both are 48dp height
  });
}

/**
 * Individual Tab
 */
@Component({
  selector: 'm3-tab',
  standalone: true,
  template: `
    <button
      role="tab"
      [attr.aria-selected]="selected()"
      [disabled]="disabled()"
      [class]="tabClasses()"
      (click)="onClick()">
      
      <!-- Content wrapper (centers text/icon) -->
      <span class="relative flex flex-col items-center justify-center h-full px-4 w-full m3-title-small">
        
        <!-- Icon -->
        @if (icon()) {
          <span class="material-symbols-rounded text-[24px] mb-1 leading-none">{{ icon() }}</span>
        }
        
        <!-- Text -->
        <span><ng-content></ng-content></span>

        <!-- Indicator (Primary: bottom, pill shape. Secondary: bottom, square, full width of content) -->
        @if (selected()) {
          <span [class]="indicatorClasses()"></span>
        }
      </span>
      
      <!-- State Layer (absolute over the tab) -->
      <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-md-sys-on-surface/8"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3TabComponent {
  selected = input<boolean>(false);
  disabled = input<boolean>(false);
  icon = input<string>('');
  
  /** Must match the parent group variant */
  variant = input<M3TabVariant>('primary');

  tabClick = output<void>();

  protected tabClasses = computed(() => {
    const active = this.selected();
    const color = active ? 'text-md-sys-primary' : 'text-md-sys-on-surface-variant';

    return [
      'relative flex-1 min-w-[90px] h-full cursor-pointer outline-none group',
      'transition-colors duration-200 ease-md-sys-standard',
      'focus-visible:bg-md-sys-on-surface/12',
      'disabled:pointer-events-none disabled:opacity-38',
      color
    ].join(' ');
  });

  protected indicatorClasses = computed(() => {
    const isPrimary = this.variant() === 'primary';
    const base = 'absolute bottom-0 bg-md-sys-primary animate-in fade-in slide-in-from-bottom-1 duration-200';
    
    // Primary: 3dp height, rounded top, matches content width
    // Secondary: 2dp height, no radius, full width
    if (isPrimary) {
      return `${base} h-[3px] rounded-t-md-sys-corner-full w-[calc(100%-32px)]`;
    }
    return `${base} h-[2px] w-full`;
  });

  protected onClick(): void {
    if (!this.disabled()) {
      this.tabClick.emit();
    }
  }
}
