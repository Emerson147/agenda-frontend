import { Injectable, inject } from '@angular/core';
import { TAREA_ENFOQUE_REPOSITORY_TOKEN } from '../tokens/tarea-enfoque.tokens';
import { Observable } from 'rxjs';
import { CicloEnfoque } from '../../domain/models/ciclo-enfoque.model';

@Injectable({
  providedIn: 'root'
})
export class IniciarCicloUseCase {
  // Inyectamos la interfaz (puerto) mediante un InjectionToken, no la implementación real
  private readonly repository = inject(TAREA_ENFOQUE_REPOSITORY_TOKEN);

  execute(tareaId: string): Observable<CicloEnfoque> {
    // Acá iría lógica de negocio de orquestación si fuera necesaria antes de persistir
    return this.repository.iniciarCiclo(tareaId);
  }
}
