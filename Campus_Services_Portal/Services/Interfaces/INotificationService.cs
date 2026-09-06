using Campus_Services_Portal.DTOs.Notifications;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationResponseDto>> GetStudentNotificationsAsync(
            int studentId);

        Task<bool> MarkAsReadAsync(
            int notificationId,
            int studentId);

        Task CreateNotificationAsync(
            int studentId,
            string title,
            string message,
            NotificationType type);
    }
}