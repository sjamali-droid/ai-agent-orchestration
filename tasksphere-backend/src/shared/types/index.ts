export type UserRole = 'admin' | 'project_manager' | 'member' | 'guest';

export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export const VALID_STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  backlog: ['in_progress'],
  in_progress: ['review'],
  review: ['done', 'in_progress'],
  done: ['backlog'],
};

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  member: 1,
  project_manager: 2,
  admin: 3,
};
