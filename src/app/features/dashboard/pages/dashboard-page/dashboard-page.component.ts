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
  durationLabel: string; // e.g. "4:00"
  pomodoros: number;
  pomodorosCompleted: number;
  timeBadge?: string;     // e.g. "10:00"
  tag: string;           // e.g. "#product"
  tagColorClass: string; // Tailwind color token
  originIcon?: string;   // e.g. "diamond", "description", "view_column"
  completed: boolean;
  subtasks?: SubTask[];
}

export interface DayColumn {
  id: string;
  dayName: string;       // e.g. "Monday"
  dateLabel: string;     // e.g. "January 10"
  totalEstimatedTime: string; // e.g. "8:00"
  progressPercent: number;
  tasks: DashboardTask[];
}

export interface TimeBlock {
  id: string;
  title: string;
  timeSpan: string;      // e.g. "7 - 7:30"
  startTime: string;     // "07:00"
  endTime: string;       // "07:30"
  durationMinutes: number;
  colorTheme: 'sky' | 'amber' | 'purple' | 'emerald';
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

  // Quick add inputs per column
  newTitles = signal<{ [columnId: string]: string }>({
    'col-monday': '',
    'col-tuesday': ''
  });

  // Multi-day Kanban Board Data (Sunsama 1:1 Layout)
  columns = signal<DayColumn[]>([
    {
      id: 'col-monday',
      dayName: 'Monday',
      dateLabel: 'September 24',
      totalEstimatedTime: '8:00',
      progressPercent: 50,
      tasks: [
        {
          id: 'm-1',
          title: 'Build daily notes feature',
          durationLabel: '4:00',
          pomodoros: 8,
          pomodorosCompleted: 4,
          tag: '#product',
          tagColorClass: 'text-indigo-600',
          originIcon: 'diamond',
          completed: false,
          subtasks: [
            { id: 'st-1', title: 'Mockups', completed: true },
            { id: 'st-2', title: 'Data model', completed: true },
            { id: 'st-3', title: 'Basic functionality', completed: false }
          ]
        },
        {
          id: 'm-2',
          title: 'Document customer feedback',
          durationLabel: '1:30',
          pomodoros: 3,
          pomodorosCompleted: 1,
          tag: '#product',
          tagColorClass: 'text-indigo-600',
          originIcon: 'view_column',
          completed: false,
          subtasks: [
            { id: 'st-4', title: 'Summarize customer churn surveys', completed: false },
            { id: 'st-5', title: 'Review top posts in Canny', completed: false }
          ]
        },
        {
          id: 'm-3',
          title: 'Investigate secondary growth channels',
          durationLabel: '1:00',
          pomodoros: 2,
          pomodorosCompleted: 0,
          tag: '#planning',
          tagColorClass: 'text-teal-600',
          completed: false
        },
        {
          id: 'm-4',
          title: 'Product demo with Jenn',
          durationLabel: '1:30',
          pomodoros: 3,
          pomodorosCompleted: 0,
          timeBadge: '10:00',
          tag: '#growth',
          tagColorClass: 'text-amber-600',
          originIcon: 'description',
          completed: false
        }
      ]
    },
    {
      id: 'col-tuesday',
      dayName: 'Tuesday',
      dateLabel: 'September 25',
      totalEstimatedTime: '4:30',
      progressPercent: 20,
      tasks: [
        {
          id: 't-1',
          title: 'Answer customer support tickets',
          durationLabel: '0:30',
          pomodoros: 1,
          pomodorosCompleted: 0,
          tag: '#growth',
          tagColorClass: 'text-amber-600',
          completed: false
        },
        {
          id: 't-2',
          title: 'Investigate secondary growth channels',
          durationLabel: '0:30',
          pomodoros: 1,
          pomodorosCompleted: 0,
          tag: '#growth',
          tagColorClass: 'text-amber-600',
          completed: false
        },
        {
          id: 't-3',
          title: 'Review prototype of new feature',
          durationLabel: '2:00',
          pomodoros: 4,
          pomodorosCompleted: 0,
          timeBadge: '10:00',
          tag: '#product',
          tagColorClass: 'text-indigo-600',
          originIcon: 'description',
          completed: false
        },
        {
          id: 't-4',
          title: '1:1 with Tomoa',
          durationLabel: '0:30',
          pomodoros: 1,
          pomodorosCompleted: 0,
          timeBadge: '11:00',
          tag: '#growth',
          tagColorClass: 'text-amber-600',
          originIcon: 'hub',
          completed: false
        }
      ]
    }
  ]);

  // Hourly timeline slots from 6 AM to 5 PM (Sunsama style 6 AM to 6 PM)
  readonly hours = [
    '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM',
    '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'
  ];

  // Calendar Scheduled Blocks
  timeBlocks = signal<TimeBlock[]>([
    {
      id: 'tb-1',
      title: 'Morning routine 7 - 7:30',
      timeSpan: '7 - 7:30',
      startTime: '07:00',
      endTime: '07:30',
      durationMinutes: 30,
      colorTheme: 'sky'
    },
    {
      id: 'tb-2',
      title: 'Product demo with Jenn',
      timeSpan: '10 - 11',
      startTime: '10:00',
      endTime: '11:00',
      durationMinutes: 60,
      colorTheme: 'amber'
    },
    {
      id: 'tb-3',
      title: 'Lunch 12 - 1',
      timeSpan: '12 - 1',
      startTime: '12:00',
      endTime: '13:00',
      durationMinutes: 60,
      colorTheme: 'sky'
    },
    {
      id: 'tb-4',
      title: 'Review prototype of new feature',
      timeSpan: '1 - 3',
      startTime: '13:00',
      endTime: '15:00',
      durationMinutes: 120,
      colorTheme: 'purple'
    }
  ]);

  // Calculations
  totalTasksToday = computed(() => {
    return this.columns()[0]?.tasks.length || 0;
  });

  completedTasksToday = computed(() => {
    return this.columns()[0]?.tasks.filter(t => t.completed).length || 0;
  });

  onInputTask(colId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newTitles.update(m => ({ ...m, [colId]: input.value }));
  }

  addTask(colId: string): void {
    const title = (this.newTitles()[colId] || '').trim();
    if (!title) return;

    const newTask: DashboardTask = {
      id: 'task-' + Date.now(),
      title,
      durationLabel: '0:50',
      pomodoros: 2,
      pomodorosCompleted: 0,
      tag: '#product',
      tagColorClass: 'text-indigo-600',
      completed: false
    };

    this.columns.update(cols =>
      cols.map(c => c.id === colId ? { ...c, tasks: [newTask, ...c.tasks] } : c)
    );

    this.newTitles.update(m => ({ ...m, [colId]: '' }));
  }

  toggleTask(colId: string, taskId: string): void {
    this.columns.update(cols =>
      cols.map(c => {
        if (c.id !== colId) return c;
        const updatedTasks = c.tasks.map(t => {
          if (t.id !== taskId) return t;
          const next = !t.completed;
          return {
            ...t,
            completed: next,
            pomodorosCompleted: next ? t.pomodoros : 0
          };
        });
        return { ...c, tasks: updatedTasks };
      })
    );
  }

  toggleSubtask(colId: string, taskId: string, subtaskId: string): void {
    this.columns.update(cols =>
      cols.map(c => {
        if (c.id !== colId) return c;
        const updatedTasks = c.tasks.map(t => {
          if (t.id !== taskId || !t.subtasks) return t;
          const updatedSubs = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubs };
        });
        return { ...c, tasks: updatedTasks };
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
    // 6 AM is minute 0. 1 hour = 64px.
    const [startH, startM] = block.startTime.split(':').map(Number);
    const startMinutesFrom6 = (startH - 6) * 60 + startM;
    const topPx = (startMinutesFrom6 / 60) * 64;
    const heightPx = Math.max(34, (block.durationMinutes / 60) * 64 - 2);

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`
    };
  }

  getBlockColorClasses(color: TimeBlock['colorTheme']): string {
    switch (color) {
      case 'sky':
        return 'bg-[#40b5f5] text-white border-transparent shadow-xs';
      case 'amber':
        return 'bg-[#f59e0b] text-white border-transparent shadow-xs';
      case 'purple':
        return 'bg-[#8b5cf6] text-white border-transparent shadow-xs';
      case 'emerald':
      default:
        return 'bg-[#10b981] text-white border-transparent shadow-xs';
    }
  }
}
