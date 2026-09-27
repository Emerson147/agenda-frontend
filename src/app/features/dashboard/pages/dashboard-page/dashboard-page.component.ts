import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TareaEnfoqueService } from '../../../../core/services/tarea-enfoque.service';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface DashboardTask {
  id: string;
  title: string;
  pomodoros: number;
  pomodorosCompleted: number;
  durationLabel: string;
  tag: string;
  tagColorClass: string;
  timeSlot?: string;
  completed: boolean;
  subtasks?: SubTask[];
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  durationMinutes: number;
  category: 'deep-work' | 'meeting' | 'routine' | 'break';
  categoryLabel: string;
}

export type FilterCategory = 'all' | 'deep-work' | 'quick' | 'completed';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css'
})
export class DashboardPageComponent {
  private tareaService = inject(TareaEnfoqueService);
  private router = inject(Router);

  // Active filter tab (Material 3 Segmented Button)
  activeFilter = signal<FilterCategory>('all');

  // Mobile view toggle (Intentions vs Daily Schedule)
  mobileTab = signal<'intentions' | 'schedule'>('intentions');

  // Intentions state
  newTaskTitle = signal<string>('');
  newTaskPomodoros = signal<number>(2);
  newTaskTag = signal<string>('deep-work');

  // Pre-populated realistic tasks aligned with Material 3 & Zen sanctuary
  tasks = signal<DashboardTask[]>([
    {
      id: 'task-1',
      title: 'Architect Focus Sanctuary layout & transitions',
      pomodoros: 3,
      pomodorosCompleted: 2,
      durationLabel: '75m',
      timeSlot: '09:00 - 10:15',
      tag: '#architecture',
      tagColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      completed: false,
      subtasks: [
        { id: 'st-1', title: 'Material 3 Expressive Bento canvas', completed: true },
        { id: 'st-2', title: 'Canonical M3 Navigation Rail implementation', completed: true },
        { id: 'st-3', title: 'Visual hourly timebox timeline synchronization', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Review pull request & token pipeline',
      pomodoros: 1,
      pomodorosCompleted: 1,
      durationLabel: '25m',
      timeSlot: '11:00 - 11:30',
      tag: '#code-review',
      tagColorClass: 'bg-stone-100 text-stone-800 border-stone-200',
      completed: true
    },
    {
      id: 'task-3',
      title: 'Audit Pomodoro state machine & audio chimes',
      pomodoros: 2,
      pomodorosCompleted: 0,
      durationLabel: '50m',
      timeSlot: '14:30 - 15:30',
      tag: '#deep-work',
      tagColorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      completed: false,
      subtasks: [
        { id: 'st-4', title: 'Test pause and resume cycles', completed: false },
        { id: 'st-5', title: 'Verify audio chime notification on completion', completed: false }
      ]
    },
    {
      id: 'task-4',
      title: 'Weekly mindfulness sync with team',
      pomodoros: 1,
      pomodorosCompleted: 0,
      durationLabel: '30m',
      timeSlot: '16:00 - 16:30',
      tag: '#meeting',
      tagColorClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      completed: false
    }
  ]);

  // Filtered tasks via M3 Segmented Buttons
  filteredTasks = computed(() => {
    const f = this.activeFilter();
    const all = this.tasks();
    if (f === 'completed') return all.filter(t => t.completed);
    if (f === 'deep-work') return all.filter(t => t.tag === '#architecture' || t.tag === '#deep-work');
    if (f === 'quick') return all.filter(t => t.pomodoros <= 1);
    return all;
  });

  // Scheduled time blocks for the daily visual calendar grid
  timeBlocks = signal<TimeBlock[]>([
    {
      id: 'b-1',
      title: 'Morning Mindfulness & Daily Intentions',
      startTime: '08:00',
      endTime: '08:30',
      durationMinutes: 30,
      category: 'routine',
      categoryLabel: 'Routine'
    },
    {
      id: 'b-2',
      title: 'Architect Focus Sanctuary layout & transitions',
      startTime: '09:00',
      endTime: '10:15',
      durationMinutes: 75,
      category: 'deep-work',
      categoryLabel: 'Deep Work'
    },
    {
      id: 'b-3',
      title: 'Review pull request & token pipeline',
      startTime: '11:00',
      endTime: '11:30',
      durationMinutes: 30,
      category: 'deep-work',
      categoryLabel: 'Deep Work'
    },
    {
      id: 'b-4',
      title: 'Mindful Lunch & Digital Detox Walk',
      startTime: '12:30',
      endTime: '13:30',
      durationMinutes: 60,
      category: 'break',
      categoryLabel: 'Break'
    },
    {
      id: 'b-5',
      title: 'Audit Pomodoro state machine & audio chimes',
      startTime: '14:30',
      endTime: '15:30',
      durationMinutes: 60,
      category: 'deep-work',
      categoryLabel: 'Deep Work'
    },
    {
      id: 'b-6',
      title: 'Weekly mindfulness sync with team',
      startTime: '16:00',
      endTime: '16:30',
      durationMinutes: 30,
      category: 'meeting',
      categoryLabel: 'Meeting'
    }
  ]);

  // Hourly slots from 07:00 to 19:00
  readonly hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00'
  ];

  // Calculated Metrics
  totalPlannedMinutes = computed(() => {
    return this.tasks().reduce((acc, t) => acc + (t.pomodoros * 25), 0);
  });

  completedMinutes = computed(() => {
    return this.tasks().reduce((acc, t) => acc + (t.pomodorosCompleted * 25), 0);
  });

  totalCompletedTasks = computed(() => {
    return this.tasks().filter(t => t.completed).length;
  });

  progressPercentage = computed(() => {
    const total = this.totalPlannedMinutes();
    if (total === 0) return 0;
    return Math.min(100, Math.round((this.completedMinutes() / total) * 100));
  });

  setFilter(filter: FilterCategory): void {
    this.activeFilter.set(filter);
  }

  onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTaskTitle.set(input?.value ?? '');
  }

  onPomodorosChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.newTaskPomodoros.set(Number(select?.value || 2));
  }

  addTask(): void {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    const newTask: DashboardTask = {
      id: 'task-' + Date.now(),
      title,
      pomodoros: this.newTaskPomodoros(),
      pomodorosCompleted: 0,
      durationLabel: `${this.newTaskPomodoros() * 25}m`,
      tag: `#${this.newTaskTag()}`,
      tagColorClass: this.newTaskTag() === 'deep-work'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
        : 'bg-stone-100 text-stone-800 border-stone-200',
      completed: false
    };

    this.tasks.update(all => [newTask, ...all]);
    this.newTaskTitle.set('');
  }

  toggleTask(taskId: string): void {
    this.tasks.update(all =>
      all.map(task => {
        if (task.id === taskId) {
          const next = !task.completed;
          return {
            ...task,
            completed: next,
            pomodorosCompleted: next ? task.pomodoros : 0
          };
        }
        return task;
      })
    );
  }

  toggleSubtask(taskId: string, subtaskId: string): void {
    this.tasks.update(all =>
      all.map(task => {
        if (task.id === taskId && task.subtasks) {
          const updated = task.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...task, subtasks: updated };
        }
        return task;
      })
    );
  }

  startFocusSession(task: DashboardTask): void {
    this.tareaService.crearTarea('practicante-1', task.title, task.pomodoros).subscribe({
      next: () => {
        this.router.navigate(['/sanctuary']);
      }
    });
  }

  enterSanctuary(): void {
    this.router.navigate(['/sanctuary']);
  }

  getBlockStyle(block: TimeBlock): { [key: string]: string } {
    // 07:00 is minute 0. 1 hour = 64px.
    const [startH, startM] = block.startTime.split(':').map(Number);
    const startMinutesFrom7 = (startH - 7) * 60 + startM;
    const topPx = Math.max(0, (startMinutesFrom7 / 60) * 64);
    const heightPx = Math.max(36, (block.durationMinutes / 60) * 64 - 4);

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`
    };
  }

  getCategoryContainerClasses(category: TimeBlock['category']): string {
    switch (category) {
      case 'deep-work':
        return 'bg-emerald-100/90 text-emerald-950 hover:bg-emerald-200/90';
      case 'meeting':
        return 'bg-amber-100/90 text-amber-950 hover:bg-amber-200/90';
      case 'break':
        return 'bg-sky-100/90 text-sky-950 hover:bg-sky-200/90';
      case 'routine':
      default:
        return 'bg-stone-200 text-stone-900 hover:bg-stone-300/80';
    }
  }

  getCategoryIcon(category: TimeBlock['category']): string {
    switch (category) {
      case 'deep-work':
        return 'spa';
      case 'meeting':
        return 'groups';
      case 'break':
        return 'coffee';
      case 'routine':
      default:
        return 'wb_sunny';
    }
  }
}
