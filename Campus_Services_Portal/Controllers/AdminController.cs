using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public AdminController(CampusXDbContext context)
        {
            _context = context;
        }

        [HttpGet("hostel-applications")]
        public async Task<IActionResult> GetHostelApplications()
        {
            var applications = await _context.HostelApplications
                .Include(h => h.Student)
                .ThenInclude(s => s.User)
                .Include(h => h.Hostel)
                .Include(h => h.Room)
                .OrderByDescending(h => h.AppliedAt)
                .Select(h => new
                {
                    h.Id,
                    StudentName = h.Student.FullName,
                    h.Student.IndexNumber,
                    Email = h.Student.User.Email,
                    HostelName = h.Hostel.Name,
                    h.Preferences,
                    Status = h.Status.ToString(),
                    RoomNumber = h.Room != null
                        ? h.Room.RoomNumber
                        : null,
                    h.AppliedAt,
                    h.UpdatedAt
                })
                .ToListAsync();

            return Ok(applications);
        }

        [HttpPut("hostel-applications/{id}/status")]
        public async Task<IActionResult> UpdateHostelStatus(
            int id,
            HostelApplicationStatus status)
        {
            var application = await _context.HostelApplications
                .FirstOrDefaultAsync(h => h.Id == id);

            if (application == null)
            {
                return NotFound(new
                {
                    message = "Hostel application not found."
                });
            }

            application.Status = status;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Hostel application status updated successfully.",
                application.Id,
                status = application.Status.ToString()
            });
        }

        [HttpPut("hostel-applications/{id}/assign-room/{roomId}")]
        public async Task<IActionResult> AssignRoom(
            int id,
            int roomId)
        {
            var application = await _context.HostelApplications
                .FirstOrDefaultAsync(h => h.Id == id);

            if (application == null)
            {
                return NotFound(new
                {
                    message = "Hostel application not found."
                });
            }

            if (application.Status != HostelApplicationStatus.Approved)
            {
                return BadRequest(new
                {
                    message = "Application must be approved before assigning a room."
                });
            }

            var room = await _context.Rooms
                .FirstOrDefaultAsync(r =>
                    r.Id == roomId &&
                    r.HostelId == application.HostelId &&
                    r.IsActive);

            if (room == null)
            {
                return NotFound(new
                {
                    message = "Room not found."
                });
            }

            var assignedCount = await _context.HostelApplications
                .CountAsync(h =>
                    h.RoomId == roomId &&
                    h.Status == HostelApplicationStatus.RoomAssigned);

            if (assignedCount >= room.Capacity)
            {
                return BadRequest(new
                {
                    message = "Room capacity is full."
                });
            }

            application.RoomId = roomId;
            application.Status = HostelApplicationStatus.RoomAssigned;
            application.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Room assigned successfully.",
                application.Id,
                room.RoomNumber
            });
        }
    }
}