export type EstadoCiclo = 'PENDIENTE' | 'EN_PROGRESO' | 'PAUSADO' | 'COMPLETADO';
export type TipoCiclo = 'POMODORO' | 'DESCANSO_CORTO' | 'DESCANSO_LARGO';

export interface CicloEnfoque {
  id: string;
  tareaId: string;
  tipo: TipoCiclo;
  estado: EstadoCiclo;
  duracionMinutos: number;
  minutosCompletados: number;
  fechaInicio?: Date;
  fechaFin?: Date;
}
