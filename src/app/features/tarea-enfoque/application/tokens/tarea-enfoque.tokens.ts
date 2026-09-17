import { InjectionToken } from '@angular/core';
import { TareaEnfoqueRepository } from '../../domain/repositories/tarea-enfoque.repository';

// Este token es la clave para la Inversión de Dependencias (DIP) de SOLID.
// Angular lo va a usar para saber qué clase inyectar cuando pidamos el TareaEnfoqueRepository.
export const TAREA_ENFOQUE_REPOSITORY_TOKEN = new InjectionToken<TareaEnfoqueRepository>('TareaEnfoqueRepository');
