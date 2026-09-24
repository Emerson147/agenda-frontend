import { Component, OnInit, inject, signal, ViewChild, ElementRef, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';

import { TareaEnfoqueService } from '../../core/services/tarea-enfoque.service';
import { UiButtonComponent } from '../../shared/ui/ui-button/ui-button.component';
import { UiInputComponent } from '../../shared/ui/ui-input/ui-input.component';
import { UiBadgeComponent } from '../../shared/ui/ui-badge/ui-badge.component';

type CycleMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

@Component({
  selector: 'app-focus-sanctuary',
  standalone: true,
  imports: [CommonModule, FormsModule, UiButtonComponent, UiInputComponent, UiBadgeComponent],
  template: `
    <div class="flex flex-col items-center justify-center w-full h-full pt-8 pb-20">
      
      <!-- Selector de Modo en Cápsula (Focus / Short Break / Long Break) -->
      <div class="flex items-center gap-1 bg-stone-100 p-1 rounded-full mb-14 border border-stone-200/60 shadow-xs">
        <button
          (click)="setMode('FOCUS')"
          [class.bg-white]="activeMode() === 'FOCUS'"
          [class.shadow-xs]="activeMode() === 'FOCUS'"
          [class.text-stone-900]="activeMode() === 'FOCUS'"
          [class.text-stone-500]="activeMode() !== 'FOCUS'"
          class="px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer">
          Focus
        </button>
        <button
          (click)="setMode('SHORT_BREAK')"
          [class.bg-white]="activeMode() === 'SHORT_BREAK'"
          [class.shadow-xs]="activeMode() === 'SHORT_BREAK'"
          [class.text-stone-900]="activeMode() === 'SHORT_BREAK'"
          [class.text-stone-500]="activeMode() !== 'SHORT_BREAK'"
          class="px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer">
          Short Break
        </button>
        <button
          (click)="setMode('LONG_BREAK')"
          [class.bg-white]="activeMode() === 'LONG_BREAK'"
          [class.shadow-xs]="activeMode() === 'LONG_BREAK'"
          [class.text-stone-900]="activeMode() === 'LONG_BREAK'"
          [class.text-stone-500]="activeMode() !== 'LONG_BREAK'"
          class="px-5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer">
          Long Break
        </button>
      </div>

      <!-- Tarea de Enfoque Único (Zen Input Atómico) -->
      <div class="mb-14 flex flex-col items-center w-full px-4">
        <ui-input
          [value]="tituloTarea()"
          (valueChange)="tituloTarea.set($event)"
          (enterPressed)="handleStartStop()"
          placeholder="What is your single focus?"
          variant="zen-hero"
          [disabled]="tareaService.isPomodoroActivo()"
          [error]="tareaService.error()"
        />

        @if (tareaService.tareaActiva(); as activa) {
          <div class="mt-3 flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span class="text-stone-400">Objetivo guardado:</span>
            <span class="text-stone-700 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200/60">{{ activa.titulo }}</span>
            <span class="text-stone-400">· Pomodoros completados: {{ activa.pomodorosCompletados || 0 }}</span>
          </div>
        }
      </div>

      <!-- Temporizador Circular (Organismo SVG con GSAP) -->
      <div class="relative flex items-center justify-center w-[340px] h-[340px]">
        <svg class="absolute inset-0 w-full h-full -rotate-90">
          <!-- Aro de fondo -->
          <circle cx="170" cy="170" r="166" stroke="#EAE8E1" stroke-width="3.5" fill="none"></circle>
          
          <!-- Aro reactivo con animación GSAP -->
          <circle
            #progressCircle
            cx="170" cy="170" r="166"
            stroke="var(--color-zen-accent)"
            stroke-width="4"
            fill="none"
            stroke-dasharray="1043"
            stroke-dashoffset="1043"
            stroke-linecap="round">
          </circle>
        </svg>

        <!-- Display de tiempo -->
        <div class="flex flex-col items-center z-10 mt-1 select-none">
          <span class="text-7xl font-light text-stone-800 tracking-tighter font-sans">
            {{ formatTime(timeLeft()) }}
          </span>

          <div class="mt-4">
            <ui-badge [pulse]="tareaService.isPomodoroActivo()">
              {{ activeMode() === 'FOCUS' ? 'Deep Work' : 'Resting' }}
            </ui-badge>
          </div>
        </div>
      </div>

      <!-- Controles Inferiores Atómicos (Shadcn Zen) -->
      <div class="flex items-center gap-12 mt-16">
        
        <!-- Botón Reset -->
        <button
          ui-button
          variant="icon"
          (btnClick)="resetTimer()"
          class="flex flex-col items-center gap-2 group text-stone-400 hover:text-stone-800 p-2">
          <div class="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-stone-100 transition-colors">
            <span class="material-symbols-rounded text-[22px]">restart_alt</span>
          </div>
          <span class="text-[11px] font-medium tracking-wide">Reset</span>
        </button>

        <!-- Botón Start / Pause Principal -->
        <button
          ui-button
          variant="icon"
          [loading]="tareaService.isLoading()"
          (btnClick)="handleStartStop()"
          class="flex flex-col items-center gap-2 group text-stone-600 hover:text-stone-900 p-2">
          <div class="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center group-hover:bg-zen-accent group-hover:text-white transition-all shadow-sm border border-stone-200 group-hover:border-transparent">
            <span class="material-symbols-rounded text-[28px] ml-0.5">
              {{ tareaService.isPomodoroActivo() ? 'pause' : 'play_arrow' }}
            </span>
          </div>
          <span class="text-[11px] font-medium tracking-wide">
            {{ tareaService.isPomodoroActivo() ? 'Pause' : 'Start' }}
          </span>
        </button>

        <!-- Botón Soundscape -->
        <button
          ui-button
          variant="icon"
          class="flex flex-col items-center gap-2 group text-stone-400 hover:text-stone-800 p-2">
          <div class="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-stone-100 transition-colors">
            <span class="material-symbols-rounded text-[22px]">music_note</span>
          </div>
          <span class="text-[11px] font-medium tracking-wide">Soundscape</span>
        </button>

      </div>

      <!-- Indicador sutil de Modo de Datos (Mock vs Backend) -->
      <div class="mt-14 flex items-center gap-2 text-[11px] text-stone-400">
        <span class="w-2 h-2 rounded-full" [class.bg-emerald-500]="tareaService.isMockMode()" [class.bg-blue-500]="!tareaService.isMockMode()"></span>
        <span>Modo Front: {{ tareaService.isMockMode() ? 'In-Memory (Sin Backend)' : 'Conectado a Spring' }}</span>
        <button
          (click)="tareaService.setMockMode(!tareaService.isMockMode())"
          class="underline hover:text-stone-600 ml-1 cursor-pointer">
          (cambiar a {{ tareaService.isMockMode() ? 'Spring HTTP' : 'Mock' }})
        </button>
      </div>

    </div>
  `
})
export class FocusSanctuaryPage implements OnInit, OnDestroy {
  public readonly tareaService = inject(TareaEnfoqueService);

  @ViewChild('progressCircle', { static: true }) progressCircle!: ElementRef<SVGCircleElement>;

  activeMode = signal<CycleMode>('FOCUS');
  timeLeft = signal<number>(45 * 60);
  maxTime = signal<number>(45 * 60);
  tituloTarea = signal<string>('');

  private timerInterval: any;
  private readonly CIRCUMFERENCE = 1043;
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
          ease: 'linear'
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
    let duration = 45 * 60;
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

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}