using Campus_Services_Portal.DTOs.Notifications;
using Campus_Services_Portal.Security;
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
        private readonly CurrentUserService _currentUserService;

        public NotificationsController(
            INotificationService notificationService,
            CurrentUserService currentUserService)
        {
            _notificationService = notificationService;
            _currentUserService = currentUserService;
        }


        // =====================================================
        // GET STUDENT NOTIFICATIONS
        // GET /api/notifications/student/{studentId}
        // STUDENT ONLY
        // =====================================================

        [HttpGet("student/{studentId}")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> GetStudentNotifications(
            int studentId)
        {
            if (studentId <= 0)
            {
                return BadRequest(
                    new
                    {
                        message = "Invalid student ID."
                    });
            }

            var currentStudentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (currentStudentId == null)
            {
                return Unauthorized(
                    new
                    {
                        message = "Invalid student identity."
                    });
            }

            // Student cannot view another student's notifications
            if (currentStudentId.Value != studentId)
            {
                return Forbid();
            }

            var notifications =
                await _notificationService
                    .GetStudentNotificationsAsync(studentId);

            return Ok(notifications);
        }


        // =====================================================
        // MARK NOTIFICATION AS READ
        // PUT /api/notifications/{id}/read
        // STUDENT ONLY
        // =====================================================

        [HttpPut("{id}/read")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            if (id <= 0)
            {
                return BadRequest(
                    new
                    {
                        message = "Invalid notification ID."
                    });
            }

            var studentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (studentId == null)
            {
                return Unauthorized(
                    new
                    {
                        message = "Invalid student identity."
                    });
            }

            try
            {
                var updated =
                    await _notificationService
                        .MarkAsReadAsync(
                            id,
                            studentId.Value);

                if (!updated)
                {
                    return NotFound(
                        new
                        {
                            message = "Notification not found."
                        });
                }

                return Ok(
                    new
                    {
                        message =
                            "Notification marked as read."
                    });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }


        // =====================================================
        // CREATE NOTIFICATION
        // POST /api/notifications
        // ADMIN ONLY
        // =====================================================

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateNotification(
            [FromBody] CreateNotificationDto dto)
        {
            if (dto == null)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Notification data is required."
                    });
            }

            if (dto.StudentId <= 0)
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Valid student ID is required."
                    });
            }

            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Notification title is required."
                    });
            }

            if (string.IsNullOrWhiteSpace(dto.Message))
            {
                return BadRequest(
                    new
                    {
                        message =
                            "Notification message is required."
                    });
            }

            await _notificationService
                .CreateNotificationAsync(
                    dto.StudentId,
                    dto.Title.Trim(),
                    dto.Message.Trim(),
                    dto.Type);

            return Ok(
                new
                {
                    message =
                        "Notification created successfully."
                });
        }
    }
}