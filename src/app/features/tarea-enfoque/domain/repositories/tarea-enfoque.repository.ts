import { CicloEnfoque } from '../models/ciclo-enfoque.model';
import { Observable } from 'rxjs';

export interface TareaEnfoqueRepository {
  /**
   * Obtiene el ciclo de enfoque actual (en progreso o pausado)
   */
  obtenerCicloActivo(): Observable<CicloEnfoque | null>;

  /**
   * Inicia un nuevo ciclo de pomodoro
   */
  iniciarCiclo(tareaId: string): Observable<CicloEnfoque>;

  /**
   * Pausa o completa el ciclo actual
   */
  actualizarEstadoCiclo(cicloId: string, estado: 'PAUSADO' | 'COMPLETADO'): Observable<CicloEnfoque>;
}
