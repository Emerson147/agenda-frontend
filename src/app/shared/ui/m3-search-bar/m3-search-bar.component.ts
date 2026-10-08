import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Search Bar Component
 * Specs: https://m3.material.io/components/search/specs
 * 
 * Container:
 * - Color: surface-container-high
 * - Height: 56dp
 * - Shape: corner-full
 */
@Component({
  selector: 'm3-search-bar',
  standalone: true,
  template: `
    <div class="flex items-center w-full h-14 px-4 bg-md-sys-surface-container-high text-md-sys-on-surface rounded-md-sys-corner-full transition-shadow duration-200 focus-within:shadow-md-sys-elevation-1">
      
      <!-- Leading Icon (Menu or Search) -->
      <button 
        type="button" 
        class="flex items-center justify-center w-12 h-12 -ml-2 rounded-full text-md-sys-on-surface hover:bg-md-sys-on-surface/8 active:bg-md-sys-on-surface/12 transition-colors outline-none"
        (click)="leadingClick.emit()">
        <span class="material-symbols-rounded text-[24px]">{{ leadingIcon() }}</span>
      </button>

      <!-- Input Field -->
      <input
        type="text"
        [placeholder]="placeholder()"
        [value]="value()"
        (input)="onInput($event)"
        class="flex-1 h-full px-2 bg-transparent outline-none m3-body-large text-md-sys-on-surface placeholder:text-md-sys-on-surface-variant" />

      <!-- Trailing Elements -->
      <div class="flex items-center">
        <!-- Optional Clear Button if there is text -->
        @if (value()) {
          <button 
            type="button" 
            class="flex items-center justify-center w-12 h-12 rounded-full text-md-sys-on-surface-variant hover:bg-md-sys-on-surface-variant/8 active:bg-md-sys-on-surface-variant/12 transition-colors outline-none"
            (click)="onClear()">
            <span class="material-symbols-rounded text-[24px]">close</span>
          </button>
        }
        
        <!-- User Avatar or other trailing icon -->
        <ng-content select="[m3-search-trailing]"></ng-content>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3SearchBarComponent {
  leadingIcon = input<string>('search');
  placeholder = input<string>('Search');
  value = input<string>('');
  
  leadingClick = output<void>();
  valueChange = output<string>();

  protected onInput(event: Event): void {
    const inputEle = event.target as HTMLInputElement;
    this.valueChange.emit(inputEle.value);
  }

  protected onClear(): void {
    this.valueChange.emit('');
  }
}
