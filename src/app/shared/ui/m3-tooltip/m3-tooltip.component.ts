import {
  Component,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Injectable,
  ComponentRef,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';

/**
 * Material Design 3 (M3) Tooltip Component
 * Specifications: https://m3.material.io/components/tooltips/specs
 *
 * Plain tooltip (Rich tooltip omitted for simplicity):
 * - Container: inverse-surface, 4dp corner
 * - Text: inverse-on-surface, body-small
 */
@Component({
  selector: 'm3-tooltip-content',
  standalone: true,
  template: `
    <div
      class="fixed z-100 px-2 py-1 bg-md-sys-inverse-surface text-md-sys-inverse-on-surface m3-body-small rounded-md-sys-corner-xs shadow-md-sys-elevation-2 pointer-events-none animate-in fade-in zoom-in-95 duration-150 whitespace-nowrap -translate-x-1/2"
      [style.left.px]="left"
      [style.top.px]="top">
      {{ text }}
    </div>
  `,
})
export class M3TooltipContentComponent {
  text = '';
  left = 0;
  top = 0;
}

@Injectable({ providedIn: 'root' })
export class M3TooltipService {
  private componentRef: ComponentRef<M3TooltipContentComponent> | null = null;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  show(text: string, left: number, top: number): void {
    if (this.componentRef) {
      this.hide();
    }
    this.componentRef = createComponent(M3TooltipContentComponent, {
      environmentInjector: this.injector,
    });
    
    this.componentRef.instance.text = text;
    this.componentRef.instance.left = left;
    this.componentRef.instance.top = top;
    
    document.body.appendChild(this.componentRef.location.nativeElement);
    this.appRef.attachView(this.componentRef.hostView);
  }

  hide(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}

/**
 * Directive to apply tooltip to any element
 * Usage: <button m3Tooltip="Click me!">Hello</button>
 */
@Directive({
  selector: '[m3Tooltip]',
  standalone: true,
})
export class M3TooltipDirective {
  @Input('m3Tooltip') text = '';
  private timeoutId: any;

  constructor(
    private el: ElementRef<HTMLElement>,
    private tooltipService: M3TooltipService
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.text) return;
    
    // Show after small delay
    this.timeoutId = setTimeout(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();
      // Position bottom center
      const top = rect.bottom + 4; // 4px margin
      const left = rect.left + rect.width / 2;
      
      this.tooltipService.show(this.text, left, top);
      
      // We would need to adjust for element width in a real scenario,
      // but the component will position its top-left at 'left'. 
      // We'll use CSS transform: translateX(-50%) to center it.
      // Modifying the component template to handle this translation:
      if ((this.tooltipService as any).componentRef) {
         const instance = (this.tooltipService as any).componentRef.instance;
         // Adjust logic if needed
      }
    }, 400); // 400ms delay to avoid flickering
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    clearTimeout(this.timeoutId);
    this.tooltipService.hide();
  }

  @HostListener('mousedown')
  onMouseDown(): void {
    clearTimeout(this.timeoutId);
    this.tooltipService.hide();
  }
}
