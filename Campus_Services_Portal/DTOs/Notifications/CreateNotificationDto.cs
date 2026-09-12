using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.DTOs.Notifications
{
    public class CreateNotificationDto
    {
        public int StudentId { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Message { get; set; } = string.Empty;

        public NotificationType Type { get; set; }
    }
}