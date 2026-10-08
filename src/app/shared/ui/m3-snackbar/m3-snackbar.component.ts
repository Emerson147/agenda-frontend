import {
  Component,
  Injectable,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';

export interface M3SnackbarAction {
  label: string;
  action: () => void;
}

export interface M3SnackbarState {
  message: string;
  action?: M3SnackbarAction;
  showClose?: boolean;
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class M3SnackbarService {
  private _state = signal<M3SnackbarState | null>(null);
  readonly state = this._state.asReadonly();
  private timeoutId: any;

  show(state: M3SnackbarState): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this._state.set(state);

    const duration = state.durationMs ?? 4000;
    if (duration > 0) {
      this.timeoutId = setTimeout(() => this.dismiss(), duration);
    }
  }

  dismiss(): void {
    this._state.set(null);
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }
}

/**
 * Material Design 3 (M3) Snackbar Component
 * Specifications: https://m3.material.io/components/snackbar/specs
 *
 * Specs:
 * - Container: Inverse surface color, corner-extra-small (4dp)
 * - Text: Inverse on-surface, Body Medium
 * - Action button: Inverse primary (Text button)
 * - Close button: Inverse on-surface
 * - Elevation: Level 3
 *
 * Usage: Place <m3-snackbar></m3-snackbar> once in your app.component.html
 */
@Component({
  selector: 'm3-snackbar',
  standalone: true,
  template: `
    @if (state()) {
      <div
        class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center min-w-86 max-w-150 min-h-12 px-4 py-3.5 bg-md-sys-inverse-surface text-md-sys-inverse-on-surface rounded-md-sys-corner-xs shadow-md-sys-elevation-3 m3-body-medium animate-in fade-in slide-in-from-bottom-4 duration-200"
        role="status"
        aria-live="polite">
        
        <span class="flex-1 mr-4">{{ state()?.message }}</span>

        @if (state()?.action) {
          <button
            type="button"
            class="h-9 px-3 -my-2 mr-2 m3-label-large text-md-sys-inverse-primary hover:bg-md-sys-inverse-primary/8 active:bg-md-sys-inverse-primary/12 rounded-md-sys-corner-full transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-md-sys-inverse-primary"
            (click)="handleAction()">
            {{ state()?.action?.label }}
          </button>
        }

        @if (state()?.showClose) {
          <button
            type="button"
            class="w-9 h-9 -my-2 -mr-2 flex items-center justify-center text-md-sys-inverse-on-surface hover:bg-md-sys-inverse-on-surface/8 active:bg-md-sys-inverse-on-surface/12 rounded-md-sys-corner-full transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-md-sys-inverse-primary"
            (click)="dismiss()"
            aria-label="Close">
            <span class="material-symbols-rounded text-[24px]">close</span>
          </button>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class M3SnackbarComponent {
  private snackbarService = inject(M3SnackbarService);
  protected state = this.snackbarService.state;

  protected handleAction(): void {
    const action = this.state()?.action;
    if (action) action.action();
    this.dismiss();
  }

  protected dismiss(): void {
    this.snackbarService.dismiss();
  }
}
