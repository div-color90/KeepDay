export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_urgent: boolean;
  is_completed: boolean;
  created_at: string;
  completed_at: string | null;
  pomodoros_completed: number;
  subject_id: string | null;
  due_date: string | null;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  type: 'focus' | 'break';
  completed: boolean;
}

export interface AppStats {
  totalPomodoros: number;
  totalFocusTime: number;
  tasksCompleted: number;
}

export interface Subject {
  id: string;
  name: string;
  teacher_name: string | null;
  teacher_id: string | null;
  schedule: string | null;
  color: string | null;
  notes: string | null;
  created_at: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  office_hours: string | null;
  notes: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: 'exam' | 'assignment' | 'class' | 'general';
  subject_id: string | null;
  created_at: string;
}

export type BlockType =
  | 'study'
  | 'work'
  | 'task'
  | 'tutoring'
  | 'review'
  | 'break'
  | 'meal'
  | 'commute'
  | 'personal'
  | 'sleep';

export interface OrgPeriod {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

export interface OrgBlock {
  id: string;
  name: string;
  block_date: string;
  start_time: string;
  end_time: string;
  block_type: BlockType;
  subject_id: string | null;
  task_id: string | null;
  recurrence: string | null;
  notes: string | null;
  pomodoros_estimated: number;
  pomodoros_completed: number;
  created_at: string;
}
