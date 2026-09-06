using System.Security.Claims;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationsController(
            INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentNotifications(
            int studentId)
        {
            var currentStudentId = GetCurrentStudentId();

            if (currentStudentId == null)
            {
                return Unauthorized(
                    new { message = "Invalid student identity." });
            }

            if (currentStudentId.Value != studentId)
            {
                return Forbid();
            }

            var notifications =
                await _notificationService
                    .GetStudentNotificationsAsync(studentId);

            return Ok(notifications);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            var studentId = GetCurrentStudentId();

            if (studentId == null)
            {
                return Unauthorized(
                    new { message = "Invalid student identity." });
            }

            try
            {
                var updated =
                    await _notificationService.MarkAsReadAsync(
                        id,
                        studentId.Value);

                if (!updated)
                {
                    return NotFound(
                        new { message = "Notification not found." });
                }

                return Ok(
                    new { message = "Notification marked as read." });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }

        private int? GetCurrentStudentId()
        {
            var claim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                return null;
            }

            if (!int.TryParse(claim.Value, out var studentId))
            {
                return null;
            }

            return studentId;
        }
    }
}