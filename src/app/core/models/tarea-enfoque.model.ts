export type TipoCiclo = 'ENFOQUE' | 'RECESO' | 'POMODORO' | 'DESCANSO_CORTO' | 'DESCANSO_LARGO';
export type EstadoCiclo = 'PENDIENTE' | 'EN_PROGRESO' | 'PAUSADO' | 'COMPLETADO';

export interface CrearTareaEnfoqueRequest {
  practicanteId: string;
  titulo: string;
  pomodorosEstimados?: number;
}

export interface IniciarCicloRequest {
  duracionMinutos: number;
  tipo: string;
}

export interface TareaEnfoque {
  id: string;
  practicanteId: string;
  titulo: string;
  pomodorosEstimados: number;
  pomodorosCompletados?: number;
  fechaCreacion?: string;
  completada?: boolean;
}

export interface CicloEnfoque {
  id: string;
  tareaId: string;
  tipo: TipoCiclo;
  estado: EstadoCiclo;
  duracionMinutos: number;
  minutosCompletados: number;
  fechaInicio?: Date | string;
  fechaFin?: Date | string;
}
