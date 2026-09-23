import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  TareaEnfoque,
  CrearTareaEnfoqueRequest,
  IniciarCicloRequest
} from '../models/tarea-enfoque.model';

@Injectable({
  providedIn: 'root'
})
export class TareaEnfoqueService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/v1/tareas-enfoque`;

  // Flag reactivo para alternar entre Mock y Backend real
  readonly isMockMode = signal<boolean>(true);

  // Estados Reactivos (Signals)
  private readonly tareaActivaSignal = signal<TareaEnfoque | null>(null);
  private readonly pomodoroActivoSignal = signal<boolean>(false);
  private readonly isLoadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Selectores Públicos computados
  readonly tareaActiva = computed(() => this.tareaActivaSignal());
  readonly isPomodoroActivo = computed(() => this.pomodoroActivoSignal());
  readonly isLoading = computed(() => this.isLoadingSignal());
  readonly error = computed(() => this.errorSignal());

  constructor() {
    this.cargarTareaDeCache();
  }

  private cargarTareaDeCache(): void {
    const guardada = localStorage.getItem('zen_tarea_activa');
    if (guardada) {
      try {
        this.tareaActivaSignal.set(JSON.parse(guardada));
      } catch {
        localStorage.removeItem('zen_tarea_activa');
      }
    }
  }

  private guardarEnCache(tarea: TareaEnfoque | null): void {
    if (tarea) {
      localStorage.setItem('zen_tarea_activa', JSON.stringify(tarea));
    } else {
      localStorage.removeItem('zen_tarea_activa');
    }
  }

  crearTarea(practicanteId: string, titulo: string, pomodorosEstimados: number = 1): Observable<TareaEnfoque> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    if (this.isMockMode()) {
      const mockTarea: TareaEnfoque = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'mock-' + Date.now(),
        practicanteId,
        titulo,
        pomodorosEstimados,
        pomodorosCompletados: 0,
        fechaCreacion: new Date().toISOString(),
        completada: false
      };

      return of(mockTarea).pipe(
        delay(250),
        tap((tarea) => {
          this.tareaActivaSignal.set(tarea);
          this.guardarEnCache(tarea);
          this.isLoadingSignal.set(false);
        })
      );
    }

    const payload: CrearTareaEnfoqueRequest = { practicanteId, titulo, pomodorosEstimados };
    return this.http.post<TareaEnfoque>(this.API_URL, payload).pipe(
      tap((tarea) => {
        this.tareaActivaSignal.set(tarea);
        this.guardarEnCache(tarea);
        this.isLoadingSignal.set(false);
      }),
      catchError((err) => {
        this.errorSignal.set(err.message || 'Error al conectar con el backend de Spring');
        this.isLoadingSignal.set(false);
        return throwError(() => err);
      })
    );
  }

  iniciarCiclo(tareaId: string, duracionMinutos: number, tipo: string): Observable<void> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    if (this.isMockMode()) {
      return of(void 0).pipe(
        delay(150),
        tap(() => {
          this.pomodoroActivoSignal.set(true);
          this.isLoadingSignal.set(false);
        })
      );
    }

    const payload: IniciarCicloRequest = { duracionMinutos, tipo };
    return this.http.post<void>(`${this.API_URL}/${tareaId}/iniciar-ciclo`, payload).pipe(
      tap(() => {
        this.pomodoroActivoSignal.set(true);
        this.isLoadingSignal.set(false);
      }),
      catchError((err) => {
        this.errorSignal.set(err.message || 'Error iniciando ciclo en el backend');
        this.isLoadingSignal.set(false);
        return throwError(() => err);
      })
    );
  }

  completarCiclo(tareaId: string): Observable<void> {
    this.isLoadingSignal.set(true);
    this.errorSignal.set(null);

    if (this.isMockMode()) {
      return of(void 0).pipe(
        delay(150),
        tap(() => {
          this.pomodoroActivoSignal.set(false);
          this.isLoadingSignal.set(false);
          const tarea = this.tareaActivaSignal();
          if (tarea) {
            const actualizada: TareaEnfoque = {
              ...tarea,
              pomodorosCompletados: (tarea.pomodorosCompletados || 0) + 1
            };
            this.tareaActivaSignal.set(actualizada);
            this.guardarEnCache(actualizada);
          }
        })
      );
    }

    return this.http.post<void>(`${this.API_URL}/${tareaId}/completar-ciclo`, {}).pipe(
      tap(() => {
        this.pomodoroActivoSignal.set(false);
        this.isLoadingSignal.set(false);
      }),
      catchError((err) => {
        this.errorSignal.set(err.message || 'Error completando ciclo en el backend');
        this.isLoadingSignal.set(false);
        return throwError(() => err);
      })
    );
  }

  pausarCicloLocal(): void {
    this.pomodoroActivoSignal.set(false);
  }

  limpiarTareaActiva(): void {
    this.tareaActivaSignal.set(null);
    this.pomodoroActivoSignal.set(false);
    this.guardarEnCache(null);
  }

  setMockMode(enabled: boolean): void {
    this.isMockMode.set(enabled);
  }
}
