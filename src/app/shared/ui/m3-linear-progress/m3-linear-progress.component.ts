import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type M3ProgressColor = 'primary' | 'tertiary' | 'secondary' | 'error';

/**
 * Material Design 3 (M3) Expressive Linear Progress Indicator
 * Official Google Specification: https://m3.material.io/components/progress-indicators/overview
 * 
 * Implements:
 * - Expressive Sinusoidal Wavy Active Indicator (fill: none, stroke-width: 4px, stroke-linecap: round)
 * - Animated continuous traveling wave motion
 * - Inactive track line with standard gap and terminal stop indicator dot
 * - Deterministic (0 - 100%) and Indeterminate states
 */
@Component({
  selector: 'm3-linear-progress',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (wavy()) {
      <!-- =====================================================================
           M3 EXPRESSIVE WAVY PROGRESS (Identical to Google Specification)
           ===================================================================== -->
      <div class="relative w-full h-5 flex items-center select-none overflow-hidden">
        
        <!-- 1. Inactive Track Line (Gray straight line after the wave) -->
        @if (clampedValue() < 100) {
          <div 
            class="absolute h-1 rounded-full bg-md-sys-surface-container-highest transition-all duration-500 ease-md-sys-emphasized"
            [style.left]="'calc(' + clampedValue() + '% + 8px)'"
            style="right: 12px;">
          </div>

          <!-- Terminal Stop Indicator Dot at 100% (M3 Spec) -->
          <div 
            class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-md-sys-surface-container-highest">
          </div>
        }

        <!-- 2. Active Wavy Indicator (Sine wave stroke with NO solid background) -->
        <div 
          class="absolute top-0 bottom-0 left-0 overflow-hidden transition-all duration-500 ease-md-sys-emphasized bg-transparent pointer-events-none"
          [style.width.%]="clampedValue()"
          [ngClass]="colorClass()">
          
          <svg 
            class="h-full w-[2500px] max-w-none animate-m3-wave text-current" 
            viewBox="0 0 2500 20" 
            fill="none">
            <path 
              [attr.d]="sineWavePath" 
              stroke="currentColor" 
              stroke-width="4" 
              stroke-linecap="round" 
              stroke-linejoin="round"
              fill="none" />
          </svg>
        </div>

      </div>

    } @else {
      <!-- =====================================================================
           Classic Flat Capsule Linear Progress
           ===================================================================== -->
      <div class="relative w-full h-1.5 flex items-center select-none">
        <!-- Inactive Track -->
        @if (clampedValue() < 100) {
          <div 
            class="absolute h-1 rounded-full bg-md-sys-surface-container-highest"
            [style.left]="'calc(' + clampedValue() + '% + 6px)'"
            style="right: 8px;">
          </div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-md-sys-surface-container-highest"></div>
        }

        <!-- Active Flat Bar -->
        <div 
          class="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500 ease-md-sys-emphasized"
          [ngClass]="flatBarColorClass()"
          [class.animate-pulse]="indeterminate()"
          [style.width.%]="clampedValue()">
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes m3-wave-travel {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(-56px);
      }
    }

    .animate-m3-wave {
      animation: m3-wave-travel 2.8s linear infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'progressbar',
    '[attr.aria-valuenow]': 'value()',
    'aria-valuemin': '0',
    'aria-valuemax': '100',
    'class': 'block w-full'
  }
})
export class M3LinearProgressComponent {
  /**
   * Progress percentage between 0 and 100
   */
  value = input<number>(0);

  /**
   * Enable M3 Expressive Wavy style (default true)
   */
  wavy = input<boolean>(true);

  /**
   * Color role: 'primary' | 'tertiary' | 'secondary' | 'error'
   */
  color = input<M3ProgressColor>('tertiary');

  /**
   * Indeterminate continuous loading state
   */
  indeterminate = input<boolean>(false);

  protected clampedValue = computed(() => {
    if (this.indeterminate()) return 100;
    return Math.min(100, Math.max(0, this.value()));
  });

  protected colorClass = computed(() => {
    switch (this.color()) {
      case 'primary': return 'text-md-sys-primary';
      case 'secondary': return 'text-md-sys-secondary';
      case 'error': return 'text-md-sys-error';
      case 'tertiary':
      default:
        return 'text-md-sys-tertiary';
    }
  });

  protected flatBarColorClass = computed(() => {
    switch (this.color()) {
      case 'primary': return 'bg-md-sys-primary';
      case 'secondary': return 'bg-md-sys-secondary';
      case 'error': return 'bg-md-sys-error';
      case 'tertiary':
      default:
        return 'bg-md-sys-tertiary';
    }
  });

  // Mathematically computed continuous sinusoidal cubic Bézier wave:
  // Center Y = 10, Amplitude = 3.8px (crests at y=6.2, troughs at y=13.8)
  // Wavelength = 28px, Stroke = 4px
  protected readonly sineWavePath: string = this.generateSineWave(2500, 28, 3.8, 10);

  private generateSineWave(totalWidth: number, wavelength: number, amplitude: number, centerY: number): string {
    let d = `M 0,${centerY}`;
    const half = wavelength / 2;
    const quarter = wavelength / 4;
    const k = quarter * 0.5523; // Cubic Bézier constant for sine curvature
    
    for (let x = 0; x < totalWidth; x += wavelength) {
      // 1. Crest (smooth sinusoidal rise and fall)
      const cp1x = x + quarter - k;
      const cp1y = centerY - amplitude;
      const cp2x = x + quarter + k;
      const cp2y = centerY - amplitude;
      const midX = x + half;
      
      // 2. Trough (smooth sinusoidal dip and rise)
      const cp3x = midX + quarter - k;
      const cp3y = centerY + amplitude;
      const cp4x = midX + quarter + k;
      const cp4y = centerY + amplitude;
      const endX = x + wavelength;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${midX},${centerY}`;
      d += ` C ${cp3x},${cp3y} ${cp4x},${cp4y} ${endX},${centerY}`;
    }
    return d;
  }
}
