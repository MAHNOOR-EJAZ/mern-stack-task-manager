import { Task, TaskFormData, TaskPriorityFilter, TaskStatusFilter, SortOption, SortOrder, MongoStatus } from '../types/task.ts';

export interface TaskQueryParams {
  status?: TaskStatusFilter;
  priority?: TaskPriorityFilter;
  search?: string;
  sort?: SortOption;
  order?: SortOrder;
}

export const api = {
  // Fetch all tasks with optional filters
  async getTasks(params?: TaskQueryParams): Promise<{ success: boolean; tasks: Task[]; source: string; count: number }> {
    const searchParams = new URLSearchParams();
    if (params?.status && params.status !== 'all') searchParams.append('status', params.status);
    if (params?.priority && params.priority !== 'all') searchParams.append('priority', params.priority);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.order) searchParams.append('order', params.order);

    const qs = searchParams.toString();
    const res = await fetch(`/api/tasks${qs ? `?${qs}` : ''}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch tasks');
    }
    return res.json();
  },

  // Create a new task
  async createTask(data: Partial<TaskFormData>): Promise<{ success: boolean; task: Task; source: string }> {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to create task');
    }
    return result;
  },

  // Update an existing task
  async updateTask(id: string, data: Partial<TaskFormData>): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to update task');
    }
    return result;
  },

  // Toggle task status
  async toggleTask(id: string): Promise<{ success: boolean; task: Task }> {
    const res = await fetch(`/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to toggle task');
    }
    return result;
  },

  // Delete a task
  async deleteTask(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || 'Failed to delete task');
    }
    return result;
  },

  // Get MongoDB status
  async getStatus(retry?: boolean): Promise<{ status: string; database: MongoStatus; environment: any }> {
    const res = await fetch(`/api/status${retry ? '?retry=true' : ''}`);
    if (!res.ok) {
      throw new Error('Failed to fetch server status');
    }
    return res.json();
  },

};
