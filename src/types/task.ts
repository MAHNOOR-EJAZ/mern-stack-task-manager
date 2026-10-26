export type PriorityLevel = 'Low' | 'Medium' | 'High';
export type TaskStatusFilter = 'all' | 'pending' | 'completed';
export type TaskPriorityFilter = 'all' | 'Low' | 'Medium' | 'High';
export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  priority: PriorityLevel;
  dueDate?: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: PriorityLevel;
  dueDate: string;
  completed: boolean;
}

export interface MongoStatus {
  isConnected: boolean;
  state: 'connected' | 'connecting' | 'disconnected' | 'error';
  host?: string;
  dbName?: string;
  error?: string | null;
  isWhitelistError?: boolean;
  usingAtlas: boolean;
  driver?: string;
  readyState?: number;
  activeCollection?: string;
  totalTasks?: number;
}
