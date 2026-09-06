using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class DashboardController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public DashboardController(CampusXDbContext context)
        {
            _context = context;
        }

        [HttpGet("student")]
        public async Task<IActionResult> GetStudentDashboard()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid token."
                });
            }

            var userId = int.Parse(userIdClaim.Value);

            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            var hostelApplication = await _context.HostelApplications
                .Where(h => h.StudentId == student.Id)
                .OrderByDescending(h => h.AppliedAt)
                .Select(h => new
                {
                    Status = h.Status.ToString(),
                    h.AppliedAt
                })
                .FirstOrDefaultAsync();

            var totalPayments = await _context.FeePayments
                .CountAsync(f => f.StudentId == student.Id);

            var paidPayments = await _context.FeePayments
                .CountAsync(f =>
                    f.StudentId == student.Id &&
                    f.Status == PaymentStatus.Paid);

            var unreadNotifications = await _context.Notifications
                .CountAsync(n =>
                    n.StudentId == student.Id &&
                    !n.IsRead);

            var eventRegistrations = await _context.EventRegistrations
                .CountAsync(e => e.StudentId == student.Id);

            var labBookings = await _context.LabBookings
                .CountAsync(l => l.StudentId == student.Id);

            var complaints = await _context.Complaints
                .CountAsync(c => c.StudentId == student.Id);

            var certificateRequests = await _context.CertificateRequests
                .CountAsync(c => c.StudentId == student.Id);

            return Ok(new
            {
                student = new
                {
                    student.Id,
                    student.IndexNumber,
                    student.FullName,
                    student.User.Email,
                    student.Faculty,
                    student.ContactNumber
                },

                hostel = hostelApplication,

                payments = new
                {
                    total = totalPayments,
                    paid = paidPayments
                },

                eventRegistrations,
                labBookings,
                complaints,
                certificateRequests,
                unreadNotifications
            });
        }
    }
}