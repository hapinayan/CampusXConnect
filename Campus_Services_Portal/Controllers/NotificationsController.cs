using Campus_Services_Portal.Data;
using Campus_Services_Portal.Security;
using Campus_Services_Portal.Services.Interfaces;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/notifications")]
    [Authorize]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _notificationService;
        private readonly CurrentUserService _currentUserService;
        private readonly CampusXDbContext _context;

        public NotificationsController(
            INotificationService notificationService,
            CurrentUserService currentUserService,
            CampusXDbContext context)
        {
            _notificationService = notificationService;
            _currentUserService = currentUserService;
            _context = context;
        }


        // =============================================
        // STUDENT NOTIFICATIONS
        // =============================================

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentNotifications(
            int studentId)
        {
            var currentStudentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (currentStudentId == null)
            {
                return Unauthorized(
                    new
                    {
                        message =
                            "Invalid student identity."
                    });
            }

            if (currentStudentId.Value != studentId)
            {
                return Forbid();
            }

            var notifications =
                await _notificationService
                    .GetStudentNotificationsAsync(
                        studentId
                    );

            return Ok(notifications);
        }


        // =============================================
        // ADMIN - GET ALL NOTIFICATIONS
        // =============================================

        [HttpGet("admin/all")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult>
            GetAllNotifications()
        {
            var notifications =
                await _context.Notifications
                    .Include(n => n.Student)
                    .OrderByDescending(
                        n => n.CreatedAt
                    )
                    .Select(n => new
                    {
                        n.Id,
                        n.StudentId,

                        StudentName =
                            n.Student != null
                                ? n.Student.FullName
                                : "Unknown Student",

                        n.Title,
                        n.Message,
                        n.Type,
                        n.IsRead,
                        n.CreatedAt
                    })
                    .ToListAsync();

            return Ok(notifications);
        }


        // =============================================
        // MARK AS READ
        // =============================================

        [HttpPut("{id}/read")]
        public async Task<IActionResult>
            MarkAsRead(int id)
        {
            var studentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (studentId == null)
            {
                return Unauthorized(
                    new
                    {
                        message =
                            "Invalid student identity."
                    });
            }

            try
            {
                var updated =
                    await _notificationService
                        .MarkAsReadAsync(
                            id,
                            studentId.Value
                        );

                if (!updated)
                {
                    return NotFound(
                        new
                        {
                            message =
                                "Notification not found."
                        });
                }

                return Ok(
                    new
                    {
                        message =
                            "Notification marked as read."
                    });
            }
            catch (
                UnauthorizedAccessException
            )
            {
                return Forbid();
            }
        }
    }
}