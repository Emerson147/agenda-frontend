import { Component, OnInit, inject, signal, ViewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

import { TareaEnfoqueService } from '../../core/services/tarea-enfoque.service';
import { 
  M3ButtonComponent, 
  M3TextFieldComponent,
  M3SegmentedButtonComponent,
  M3SegmentedButtonSegmentComponent,
  M3FabComponent,
  M3ChipComponent,
  M3IconButtonComponent
} from '../../shared/ui';

type CycleMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

@Component({
  selector: 'app-focus-sanctuary',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    M3ButtonComponent, 
    M3TextFieldComponent,
    M3SegmentedButtonComponent,
    M3SegmentedButtonSegmentComponent,
    M3FabComponent,
    M3ChipComponent,
    M3IconButtonComponent
  ],
  template: `
    <div class="bg-md-sys-background text-md-sys-on-surface antialiased h-full flex m3-fade-enter">
      <!-- Main Content -->
      <div class="flex-1 flex flex-col h-full">
        
        <header class="sticky top-0 h-16 bg-md-sys-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-6 lg:px-12 border-b border-md-sys-outline/5">
          <div class="flex items-center gap-4 sm:gap-4">
            <span class="m3-body-small text-md-sys-outline capitalize hidden sm:inline">lunes, 21 de octubre</span>
            <span class="w-1 h-1 rounded-full bg-md-sys-outline-variant hidden sm:inline"></span>
            <span class="m3-label-small text-md-sys-on-surface-variant">otoño • silencio matutino</span>
          </div>
        </header>

        <main class="relative flex-1 bg-md-sys-surface px-4 sm:px-6 lg:px-12 max-w-5xl mx-auto w-full pt-8 pb-20">
          <div class="flex flex-col w-full">
            
            <div class="relative w-full max-w-4xl mx-auto flex flex-col items-center">
              
              <!-- Mode Tabs -->
              <div class="w-full flex justify-center py-2 sm:py-6">
                <m3-segmented-button>
                  <m3-segmented-button-segment 
                    [selected]="activeMode() === 'FOCUS'" 
                    (segmentClick)="setMode('FOCUS')"
                    icon="psychology">
                    Enfoque • 25m
                  </m3-segmented-button-segment>
                  <m3-segmented-button-segment 
                    [selected]="activeMode() === 'SHORT_BREAK'" 
                    (segmentClick)="setMode('SHORT_BREAK')"
                    icon="coffee">
                    Pausa Corta • 5m
                  </m3-segmented-button-segment>
                  <m3-segmented-button-segment 
                    [selected]="activeMode() === 'LONG_BREAK'" 
                    (segmentClick)="setMode('LONG_BREAK')"
                    icon="bed">
                    Pausa Larga • 15m
                  </m3-segmented-button-segment>
                </m3-segmented-button>
              </div>

              <!-- Circle Timer -->
              <div class="relative my-10 flex flex-col items-center justify-center select-none m3-shared-axis-z-enter">
                <div class="absolute w-80 h-80 rounded-full bg-md-sys-primary/10 blur-3xl pointer-events-none -z-10"></div>
                
                <div class="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
                  <svg aria-hidden="true" class="w-full h-full -rotate-90 transform drop-shadow-sm" viewBox="0 0 260 260">
                    <circle class="text-md-sys-surface-container-highest" cx="130" cy="130" fill="none" r="118" stroke="currentColor" stroke-width="2.5"></circle>
                    <circle 
                      #progressCircle
                      class="text-md-sys-primary" 
                      cx="130" cy="130" fill="none" r="118" 
                      stroke="currentColor" 
                      stroke-dasharray="741.42" 
                      stroke-dashoffset="0" 
                      stroke-linecap="round" 
                      stroke-width="4"></circle>
                  </svg>
                  
                  <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span class="m3-label-small uppercase tracking-widest text-md-sys-outline mb-2">respiración constante</span>
                    <div class="text-[64px] sm:text-[84px] leading-none text-md-sys-on-surface font-light tracking-tighter tabular-nums">
                      {{ formatTime(timeLeft()) }}
                    </div>
                    <div class="flex items-center gap-2 mt-4 text-md-sys-on-surface-variant">
                      <span class="material-symbols-rounded text-sm text-md-sys-primary">spa</span>
                      <span class="m3-label-small tracking-wider uppercase text-md-sys-outline">fase 03 de 04</span>
                    </div>
                  </div>
                </div>

                <!-- Controls -->
                <div class="flex items-center gap-6 mt-10">
                  <button m3-icon-button variant="standard" (click)="resetTimer()" title="Reiniciar sesión">
                    restart_alt
                  </button>
                  
                  <button m3-fab size="large" [color]="tareaService.isPomodoroActivo() ? 'secondary' : 'primary'" (fabClick)="handleStartStop()">
                    {{ tareaService.isPomodoroActivo() ? 'pause' : 'play_arrow' }}
                  </button>
                  
                  <button m3-button variant="tonal" (btnClick)="addFiveMinutes()" title="Ampliar 5 minutos">
                    +5m
                  </button>
                </div>
              </div>

              <!-- Zen Composition Columns -->
              <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
                
                <!-- Focus Task Column -->
                <section class="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-md-sys-corner-xl bg-md-sys-surface-container-low border border-md-sys-outline/10 shadow-2xs">
                  <div>
                    <div class="flex items-center justify-between pb-4 mb-2">
                      <div class="flex items-center gap-2">
                        <span class="w-2 h-2 rounded-full bg-md-sys-primary animate-pulse"></span>
                        <span class="m3-label-small uppercase tracking-widest text-md-sys-outline">foco único activo</span>
                      </div>
                      <div class="flex items-center gap-1.5 text-md-sys-on-surface-variant">
                        <span class="m3-label-small mr-1 text-md-sys-outline">ritmo</span>
                        <span class="w-2 h-2 rounded-full bg-md-sys-primary"></span>
                        <span class="w-2 h-2 rounded-full bg-md-sys-primary"></span>
                        <span class="w-2 h-2 rounded-full bg-md-sys-primary"></span>
                        <span class="w-2 h-2 rounded-full bg-md-sys-surface-container-highest"></span>
                      </div>
                    </div>
                    
                    <div class="mt-2 w-full">
                      <m3-text-field
                        [ngModel]="tituloTarea()"
                        (ngModelChange)="tituloTarea.set($event)"
                        (keyup.enter)="handleStartStop()"
                        label="What is your single focus?"
                        variant="filled"
                        [disabled]="tareaService.isPomodoroActivo()"
                        [errorText]="tareaService.error() || ''"
                        class="w-full block"
                      />
                    </div>
                  </div>
                  
                  <div class="mt-8 pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-md-sys-outline/5">
                    <div class="flex items-center gap-2">
                      <m3-chip variant="assist">Arquitectura</m3-chip>
                      <m3-chip variant="assist">Caligrafía digital</m3-chip>
                    </div>
                    
                    <div class="flex items-center gap-3 bg-md-sys-surface-container-highest/50 px-4 py-2 rounded-full shadow-sm border border-md-sys-outline/10">
                      <span class="material-symbols-rounded text-[16px] text-md-sys-primary">eco</span>
                      <span class="m3-label-small text-md-sys-on-surface">Viento en bambú</span>
                      <div class="w-12 h-1 bg-md-sys-surface-container-highest rounded-full overflow-hidden flex items-center">
                        <div class="h-full w-2/5 bg-md-sys-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Ephemeral Thoughts -->
                <section class="lg:col-span-5 flex flex-col p-6 sm:p-8 rounded-md-sys-corner-xl bg-md-sys-surface-container-low border border-md-sys-outline/10 shadow-2xs justify-between">
                  <div>
                    <div class="flex items-center justify-between pb-3 mb-2">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-rounded text-[16px] text-md-sys-outline">history_edu</span>
                        <h3 class="m3-label-small uppercase tracking-widest text-md-sys-outline">pensamientos fugaces</h3>
                      </div>
                      <span class="m3-label-small text-md-sys-outline">depósito efímero</span>
                    </div>
                    <p class="m3-body-small text-md-sys-on-surface-variant mb-5 font-light">
                      Descargue distracciones sin romper la inmersión. Desaparecen al cerrar el ciclo.
                    </p>
                    
                    <div class="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      @for (note of ephemeralNotes(); track note; let i = $index) {
                        <div class="flex items-start gap-3 p-3 rounded-md-sys-corner-sm bg-md-sys-surface-container-lowest text-md-sys-on-surface m3-body-small transition-all border border-md-sys-outline/5 hover:border-md-sys-outline/20">
                          <span class="material-symbols-rounded text-[16px] text-md-sys-outline mt-0.5">remove</span>
                          <span class="flex-1 font-light leading-relaxed">{{ note }}</span>
                          <button m3-icon-button variant="standard" (click)="removeEphemeralNote(i)" class="scale-75 -mt-1 -mr-1 opacity-60 hover:opacity-100" title="Descartar">
                            done
                          </button>
                        </div>
                      }
                      @if (ephemeralNotes().length === 0) {
                        <div class="text-center py-6 text-md-sys-on-surface-variant m3-body-small font-light italic opacity-70">
                          Mente despejada...
                        </div>
                      }
                    </div>
                  </div>
                  
                  <div class="mt-6 pt-4 flex items-center gap-3 border-t border-md-sys-outline/5 w-full">
                    <div class="flex-1 min-w-0">
                      <m3-text-field
                        [ngModel]="newNote()"
                        (ngModelChange)="newNote.set($event)"
                        (keyup.enter)="addEphemeralNote()"
                        placeholder="Anotar idea y soltar..."
                        variant="filled"
                        class="w-full block"
                      />
                    </div>
                    <button m3-fab size="small" color="secondary" (fabClick)="addEphemeralNote()" [disabled]="!newNote().trim()">
                      arrow_upward
                    </button>
                  </div>
                </section>
              </div>

              <!-- Footer -->
              <footer class="w-full mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between text-md-sys-outline m3-body-small gap-4 border-t border-md-sys-outline/10">
                <div class="flex items-center gap-3">
                  <span class="w-1.5 h-1.5 rounded-full bg-md-sys-primary/50"></span>
                  <span class="font-light italic">“La calma exterior cultiva la profundidad del pensamiento.”</span>
                </div>
                <div class="flex items-center gap-6 m3-label-small uppercase tracking-widest">
                  <span>total hoy • 1h 45m</span>
                  <span>té • sencha</span>
                </div>
              </footer>

            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: var(--color-md-sys-outline-variant);
      border-radius: 4px;
    }
  `]
})
export class FocusSanctuaryPage implements OnInit, OnDestroy {
  public readonly tareaService = inject(TareaEnfoqueService);

  @ViewChild('progressCircle', { static: true }) progressCircle!: ElementRef<SVGCircleElement>;

  activeMode = signal<CycleMode>('FOCUS');
  timeLeft = signal<number>(25 * 60);
  maxTime = signal<number>(25 * 60);
  tituloTarea = signal<string>('');
  
  ephemeralNotes = signal<string[]>([
    'Comprobar muestra de tipografía en monitor mate',
    'Escribir agradecimiento a Kengo por el prólogo'
  ]);
  newNote = signal<string>('');

  private timerInterval: any;
  private readonly CIRCUMFERENCE = 741.42;
  private readonly MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

  constructor() {
    effect(() => {
      const remaining = this.timeLeft();
      const max = this.maxTime();
      const percentage = remaining / max;
      const offset = this.CIRCUMFERENCE - (percentage * this.CIRCUMFERENCE);

      if (this.progressCircle?.nativeElement) {
        gsap.to(this.progressCircle.nativeElement, {
          strokeDashoffset: offset,
          duration: 1,
          ease: 'power3.out' // M3 Zen feeling
        });
      }
    });

    // Cargar título guardado si existe tarea activa previa
    effect(() => {
      const activa = this.tareaService.tareaActiva();
      if (activa && !this.tituloTarea()) {
        this.tituloTarea.set(activa.titulo);
      }
    });
  }

  ngOnInit() {
    if (this.progressCircle?.nativeElement) {
      gsap.set(this.progressCircle.nativeElement, { strokeDashoffset: 0 });
    }
  }

  ngOnDestroy() {
    this.stopLocalTimer();
  }

  setMode(mode: CycleMode) {
    if (this.tareaService.isPomodoroActivo()) return;

    this.activeMode.set(mode);
    let duration = 25 * 60; // Default FOCUS time 25m as per HTML
    if (mode === 'SHORT_BREAK') duration = 5 * 60;
    if (mode === 'LONG_BREAK') duration = 15 * 60;

    this.maxTime.set(duration);
    this.timeLeft.set(duration);
  }

  handleStartStop() {
    if (this.tareaService.isPomodoroActivo()) {
      this.stopLocalTimer();
      this.tareaService.pausarCicloLocal();
      return;
    }

    const titulo = this.tituloTarea().trim();
    if (!titulo) {
      alert('Por favor definí tu único foco de atención antes de iniciar.');
      return;
    }

    const tareaActual = this.tareaService.tareaActiva();
    if (!tareaActual || tareaActual.titulo !== titulo) {
      this.tareaService.crearTarea(this.MOCK_USER_ID, titulo, 1).subscribe({
        next: (nuevaTarea) => {
          this.dispararCiclo(nuevaTarea.id);
        }
      });
    } else {
      this.dispararCiclo(tareaActual.id);
    }
  }

  private dispararCiclo(tareaId: string) {
    const tipo = this.activeMode() === 'FOCUS' ? 'ENFOQUE' : 'RECESO';
    const duracionMinutos = Math.round(this.maxTime() / 60);

    this.tareaService.iniciarCiclo(tareaId, duracionMinutos, tipo).subscribe({
      next: () => {
        this.startLocalTimer();
      }
    });
  }

  private startLocalTimer() {
    if (this.timeLeft() <= 0) return;
    this.stopLocalTimer();

    this.timerInterval = setInterval(() => {
      const current = this.timeLeft();
      if (current > 0) {
        this.timeLeft.set(current - 1);
      } else {
        this.stopLocalTimer();
        const tarea = this.tareaService.tareaActiva();
        if (tarea) {
          this.tareaService.completarCiclo(tarea.id).subscribe();
        }
      }
    }, 1000);
  }

  private stopLocalTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopLocalTimer();
    this.tareaService.pausarCicloLocal();
    this.timeLeft.set(this.maxTime());
  }
  
  addFiveMinutes() {
    this.timeLeft.update(t => t + 5 * 60);
    this.maxTime.update(t => t + 5 * 60);
  }
  
  addEphemeralNote() {
    const note = this.newNote().trim();
    if (note) {
      this.ephemeralNotes.update(notes => [note, ...notes]);
      this.newNote.set('');
    }
  }

  removeEphemeralNote(index: number) {
    this.ephemeralNotes.update(notes => {
      const copy = [...notes];
      copy.splice(index, 1);
      return copy;
    });
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}