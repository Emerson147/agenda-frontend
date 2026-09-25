import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TareaEnfoqueService } from '../../../../core/services/tarea-enfoque.service';

export interface DashboardTask {
  id: string;
  title: string;
  pomodoros: number;
  pomodorosCompleted: number;
  timeSlot?: string;
  tag: string;
  tagColor: string;
  completed: boolean;
  subtasks?: { title: string; completed: boolean }[];
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  durationMinutes: number;
  category: 'deep-work' | 'meeting' | 'routine' | 'break';
  taskId?: string;
}

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

  // Date and view state
  currentDate = signal<Date>(new Date());
  activeMobileTab = signal<'tasks' | 'timeline'>('tasks');
  newTaskTitle = signal<string>('');
  newTaskPomodoros = signal<number>(2);
  newTaskTag = signal<string>('deep-work');

  onTitleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTaskTitle.set(input?.value ?? '');
  }

  onPomodorosChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.newTaskPomodoros.set(Number(select?.value || 2));
  }

  // Pre-populated realistic tasks aligned with Sunsama/Akiflow timeboxing
  tasks = signal<DashboardTask[]>([
    {
      id: 'task-1',
      title: 'Design Sanctuary timeboxing layout',
      pomodoros: 3,
      pomodorosCompleted: 2,
      timeSlot: '09:00 - 10:30',
      tag: '#architecture',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      completed: false,
      subtasks: [
        { title: 'Sunsama dual-column layout', completed: true },
        { title: 'M3 Expressive timeline cards', completed: true },
        { title: 'Floating navigation dock integration', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Review pull request & token pipeline',
      pomodoros: 1,
      pomodorosCompleted: 1,
      timeSlot: '11:00 - 11:30',
      tag: '#code-review',
      tagColor: 'bg-stone-100 text-stone-800 border-stone-200',
      completed: true
    },
    {
      id: 'task-3',
      title: 'Focus Sanctuary state machine audit',
      pomodoros: 2,
      pomodorosCompleted: 0,
      timeSlot: '14:30 - 15:30',
      tag: '#deep-work',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      completed: false,
      subtasks: [
        { title: 'Test pause and resume cycles', completed: false },
        { title: 'Verify audio chime notification', completed: false }
      ]
    },
    {
      id: 'task-4',
      title: 'Weekly mindfulness sync with team',
      pomodoros: 1,
      pomodorosCompleted: 0,
      timeSlot: '16:00 - 16:30',
      tag: '#meeting',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
      completed: false
    }
  ]);

  // Scheduled time blocks for the daily calendar grid (Sunsama style)
  timeBlocks = signal<TimeBlock[]>([
    {
      id: 'b-1',
      title: 'Morning Mindfulness & Intentions',
      startTime: '08:00',
      endTime: '08:30',
      durationMinutes: 30,
      category: 'routine'
    },
    {
      id: 'b-2',
      title: 'Design Sanctuary timeboxing layout',
      startTime: '09:00',
      endTime: '10:30',
      durationMinutes: 90,
      category: 'deep-work',
      taskId: 'task-1'
    },
    {
      id: 'b-3',
      title: 'Review pull request & token pipeline',
      startTime: '11:00',
      endTime: '11:30',
      durationMinutes: 30,
      category: 'deep-work',
      taskId: 'task-2'
    },
    {
      id: 'b-4',
      title: 'Mindful Lunch & Digital Detox Walk',
      startTime: '12:30',
      endTime: '13:30',
      durationMinutes: 60,
      category: 'break'
    },
    {
      id: 'b-5',
      title: 'Focus Sanctuary state machine audit',
      startTime: '14:30',
      endTime: '15:30',
      durationMinutes: 60,
      category: 'deep-work',
      taskId: 'task-3'
    },
    {
      id: 'b-6',
      title: 'Weekly mindfulness sync with team',
      startTime: '16:00',
      endTime: '16:30',
      durationMinutes: 30,
      category: 'meeting',
      taskId: 'task-4'
    }
  ]);

  // Hourly timeline slots from 07:00 to 19:00
  readonly hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', 
    '17:00', '18:00', '19:00'
  ];

  // Calculated metrics
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

  toggleTask(taskId: string) {
    this.tasks.update(all =>
      all.map(task => {
        if (task.id === taskId) {
          const nextState = !task.completed;
          return {
            ...task,
            completed: nextState,
            pomodorosCompleted: nextState ? task.pomodoros : task.pomodorosCompleted
          };
        }
        return task;
      })
    );
  }

  toggleSubtask(taskId: string, subtaskIndex: number) {
    this.tasks.update(all =>
      all.map(task => {
        if (task.id === taskId && task.subtasks) {
          const updatedSubtasks = task.subtasks.map((st, idx) => 
            idx === subtaskIndex ? { ...st, completed: !st.completed } : st
          );
          return { ...task, subtasks: updatedSubtasks };
        }
        return task;
      })
    );
  }

  addTask() {
    const title = this.newTaskTitle().trim();
    if (!title) return;

    const newTask: DashboardTask = {
      id: 'task-' + Date.now(),
      title,
      pomodoros: this.newTaskPomodoros(),
      pomodorosCompleted: 0,
      tag: `#${this.newTaskTag()}`,
      tagColor: this.newTaskTag() === 'deep-work'
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
        : 'bg-stone-100 text-stone-800 border-stone-200',
      completed: false
    };

    this.tasks.update(all => [newTask, ...all]);
    this.newTaskTitle.set('');
  }

  startFocusSession(task: DashboardTask) {
    // Set active task on TareaEnfoqueService and navigate directly to /sanctuary
    this.tareaService.crearTarea('practicante-1', task.title, task.pomodoros).subscribe({
      next: () => {
        this.router.navigate(['/sanctuary']);
      }
    });
  }

  enterSanctuary() {
    this.router.navigate(['/sanctuary']);
  }

  getBlockStyle(block: TimeBlock): { [key: string]: string } {
    // 07:00 is minute 0. 1 hour = 64px height.
    const [startH, startM] = block.startTime.split(':').map(Number);
    const startMinutesFrom7 = (startH - 7) * 60 + startM;
    const topPx = Math.max(0, (startMinutesFrom7 / 60) * 64);
    const heightPx = Math.max(36, (block.durationMinutes / 60) * 64 - 4);

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`
    };
  }

  getCategoryClasses(category: TimeBlock['category']): string {
    switch (category) {
      case 'deep-work':
        return 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100/90 shadow-2xs';
      case 'meeting':
        return 'bg-amber-50/90 border-amber-300 text-amber-950 hover:bg-amber-100/90 shadow-2xs';
      case 'break':
        return 'bg-sky-50/90 border-sky-300 text-sky-950 hover:bg-sky-100/90 shadow-2xs';
      case 'routine':
      default:
        return 'bg-stone-100/90 border-stone-300 text-stone-800 hover:bg-stone-200/90 shadow-2xs';
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
