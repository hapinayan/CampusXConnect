export interface Notification {
  id: number;
  studentId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}