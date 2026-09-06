using Campus_Services_Portal.DTOs.Notifications;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class NotificationService : INotificationService
    {
        private readonly INotificationRepository _notificationRepository;

        public NotificationService(
            INotificationRepository notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<IEnumerable<NotificationResponseDto>>
            GetStudentNotificationsAsync(int studentId)
        {
            var notifications =
                await _notificationRepository.GetByStudentIdAsync(studentId);

            return notifications.Select(notification =>
                new NotificationResponseDto
                {
                    Id = notification.Id,
                    StudentId = notification.StudentId,
                    Title = notification.Title,
                    Message = notification.Message,
                    Type = notification.Type,
                    IsRead = notification.IsRead,
                    CreatedAt = notification.CreatedAt
                });
        }

        public async Task<bool> MarkAsReadAsync(
            int notificationId,
            int studentId)
        {
            var notification =
                await _notificationRepository.GetByIdAsync(notificationId);

            if (notification == null)
            {
                return false;
            }

            if (notification.StudentId != studentId)
            {
                throw new UnauthorizedAccessException(
                    "You cannot access another student's notification.");
            }

            notification.IsRead = true;

            await _notificationRepository.UpdateAsync(notification);

            return true;
        }

        public async Task CreateNotificationAsync(
            int studentId,
            string title,
            string message,
            NotificationType type)
        {
            var notification = new Notification
            {
                StudentId = studentId,
                Title = title,
                Message = message,
                Type = type,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _notificationRepository.AddAsync(notification);
        }
    }
}