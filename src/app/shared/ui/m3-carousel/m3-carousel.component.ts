import {
  Component,
  ChangeDetectionStrategy,
} from '@angular/core';

/**
 * Material Design 3 (M3) Carousel Component
 * Specs: https://m3.material.io/components/carousel/specs
 * 
 * Carousel is essentially a horizontally scrollable container with snap behavior.
 */
@Component({
  selector: 'm3-carousel',
  standalone: true,
  template: `
    <div class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-2 py-4 px-4 w-full">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3CarouselComponent {}

/**
 * M3 Carousel Item
 * Specs: 
 * - Shape: corner-extra-large (28dp)
 */
@Component({
  selector: 'm3-carousel-item',
  standalone: true,
  template: `
    <div class="flex-none snap-center rounded-md-sys-corner-extra-large overflow-hidden">
      <ng-content></ng-content>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3CarouselItemComponent {}
