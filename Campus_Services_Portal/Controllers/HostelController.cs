using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
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
    public class HostelController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public HostelController(CampusXDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetHostels()
        {
            var hostels = await _context.Hostels
                .Include(h => h.Rooms)
                .Select(h => new
                {
                    h.Id,
                    h.Name,
                    h.Location,
                    Rooms = h.Rooms
                        .Where(r => r.IsActive)
                        .Select(r => new
                        {
                            r.Id,
                            r.RoomNumber,
                            r.Capacity
                        })
                })
                .ToListAsync();

            return Ok(hostels);
        }

        [HttpPost("apply")]
        public async Task<IActionResult> ApplyForHostel(
            int hostelId,
            string preferences)
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
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            var hostelExists = await _context.Hostels
                .AnyAsync(h => h.Id == hostelId);

            if (!hostelExists)
            {
                return NotFound(new
                {
                    message = "Hostel not found."
                });
            }

            var existingApplication = await _context.HostelApplications
                .AnyAsync(h =>
                    h.StudentId == student.Id &&
                    h.Status != HostelApplicationStatus.Rejected);

            if (existingApplication)
            {
                return BadRequest(new
                {
                    message = "You already have an active hostel application."
                });
            }

            var application = new HostelApplication
            {
                StudentId = student.Id,
                HostelId = hostelId,
                Preferences = preferences,
                Status = HostelApplicationStatus.Pending,
                AppliedAt = DateTime.UtcNow
            };

            _context.HostelApplications.Add(application);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Hostel application submitted successfully."
            });
        }

        [HttpGet("my-application")]
        public async Task<IActionResult> GetMyApplication()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            var userId = int.Parse(userIdClaim.Value);

            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.UserId == userId);

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            var application = await _context.HostelApplications
                .Include(h => h.Hostel)
                .Include(h => h.Room)
                .Where(h => h.StudentId == student.Id)
                .OrderByDescending(h => h.AppliedAt)
                .Select(h => new
                {
                    h.Id,
                    HostelName = h.Hostel.Name,
                    h.Preferences,
                    Status = h.Status.ToString(),
                    RoomNumber = h.Room != null
                        ? h.Room.RoomNumber
                        : null,
                    h.AppliedAt,
                    h.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (application == null)
            {
                return NotFound(new
                {
                    message = "No hostel application found."
                });
            }

            return Ok(application);
        }
    }
}