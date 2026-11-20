export type Priority = 'Baja' | 'Media' | 'Alta';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  createdAt: Date;
}

export type ActiveTab = 'simulator' | 'code' | 'explanation';
