import { Injectable, signal, computed, inject } from '@angular/core';
import { CicloEnfoque } from '../../domain/models/ciclo-enfoque.model';
import { IniciarCicloUseCase } from '../use-cases/iniciar-ciclo.use-case';

@Injectable({
  providedIn: 'root'
})
export class TareaEnfoqueState {
  private readonly iniciarCicloUseCase = inject(IniciarCicloUseCase);

  // ESTADO PRIVADO (Signals)
  private readonly cicloActualSignal = signal<CicloEnfoque | null>(null);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // SELECTORES PÚBLICOS (Computed Signals)
  // La UI (Atomic Design) se va a suscribir a estos de forma reactiva y sincrónica
  readonly cicloActual = computed(() => this.cicloActualSignal());
  readonly isLoading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());
  readonly isPomodoroActivo = computed(() => this.cicloActualSignal()?.estado === 'EN_PROGRESO');

  // ACCIONES (Mutan el estado usando los Casos de Uso)
  iniciarNuevoPomodoro(tareaId: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.iniciarCicloUseCase.execute(tareaId).subscribe({
      next: (ciclo) => {
        this.cicloActualSignal.set(ciclo);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(err.message || 'Error al iniciar el pomodoro');
        this.loadingSignal.set(false);
      }
    });
  }

  // TODO: Agregar acción para pausar/completar llamando al respectivo caso de uso
}
