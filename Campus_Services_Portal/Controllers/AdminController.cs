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


        // =====================================================
        // STUDENTS
        // =====================================================

        // GET ALL STUDENTS
        // GET: api/Admin/students
        // =====================================================

        [HttpGet("students")]
        public async Task<IActionResult> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .OrderBy(s => s.FullName)
                .Select(s => new
                {
                    s.Id,
                    s.UserId,
                    s.IndexNumber,
                    s.FullName,
                    s.Faculty,
                    s.ContactNumber,
                    Email = s.User.Email,
                    IsActive = s.User.IsActive
                })
                .ToListAsync();

            return Ok(students);
        }


        // =====================================================
        // ACTIVATE / DEACTIVATE STUDENT
        // =====================================================

        // PUT:
        // api/Admin/students/{id}/status?isActive=true
        // =====================================================

        [HttpPut("students/{id}/status")]
        public async Task<IActionResult> UpdateStudentStatus(
            int id,
            [FromQuery] bool isActive)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .FirstOrDefaultAsync(
                    s => s.Id == id
                );

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }


            student.User.IsActive = isActive;

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = isActive
                    ? "Student activated successfully."
                    : "Student deactivated successfully.",

                student.Id,

                isActive = student.User.IsActive
            });
        }


        // =====================================================
        // HOSTEL APPLICATIONS
        // =====================================================

        // GET:
        // api/Admin/hostel-applications
        // =====================================================

        [HttpGet("hostel-applications")]
        public async Task<IActionResult>
            GetHostelApplications()
        {
            var applications =
                await _context.HostelApplications

                .Include(h => h.Student)
                .ThenInclude(s => s.User)

                .Include(h => h.Hostel)

                .Include(h => h.Room)

                .OrderByDescending(
                    h => h.AppliedAt
                )

                .Select(h => new
                {
                    h.Id,

                    StudentName =
                        h.Student.FullName,

                    h.Student.IndexNumber,

                    Email =
                        h.Student.User.Email,

                    HostelName =
                        h.Hostel.Name,

                    h.Preferences,

                    Status =
                        h.Status.ToString(),

                    RoomNumber =
                        h.Room != null
                            ? h.Room.RoomNumber
                            : null,

                    h.AppliedAt,

                    h.UpdatedAt
                })

                .ToListAsync();


            return Ok(applications);
        }


        // =====================================================
        // GET ACTIVE ROOMS
        // =====================================================

        // GET:
        // api/Admin/rooms
        // =====================================================

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _context.Rooms

                .Where(r => r.IsActive)

                .OrderBy(r => r.HostelId)

                .ThenBy(r => r.RoomNumber)

                .Select(r => new
                {
                    r.Id,

                    r.HostelId,

                    r.RoomNumber,

                    r.Capacity
                })

                .ToListAsync();


            return Ok(rooms);
        }


        // =====================================================
        // UPDATE HOSTEL APPLICATION STATUS
        // =====================================================

        // PUT:
        // api/Admin/hostel-applications/{id}/status?status=1
        // =====================================================

        [HttpPut("hostel-applications/{id}/status")]
        public async Task<IActionResult>
            UpdateHostelStatus(
                int id,
                [FromQuery]
                HostelApplicationStatus status)
        {
            var application =
                await _context.HostelApplications
                    .FirstOrDefaultAsync(
                        h => h.Id == id
                    );


            if (application == null)
            {
                return NotFound(new
                {
                    message =
                        "Hostel application not found."
                });
            }


            application.Status = status;

            application.UpdatedAt =
                DateTime.UtcNow;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Hostel application status updated successfully.",

                application.Id,

                status =
                    application.Status.ToString()
            });
        }


        // =====================================================
        // ASSIGN ROOM
        // =====================================================

        // PUT:
        // api/Admin/hostel-applications/{id}/assign-room/{roomId}
        // =====================================================

        [HttpPut(
            "hostel-applications/{id}/assign-room/{roomId}"
        )]
        public async Task<IActionResult>
            AssignRoom(
                int id,
                int roomId)
        {
            // -------------------------------------------------
            // FIND APPLICATION
            // -------------------------------------------------

            var application =
                await _context.HostelApplications
                    .FirstOrDefaultAsync(
                        h => h.Id == id
                    );


            if (application == null)
            {
                return NotFound(new
                {
                    message =
                        "Hostel application not found."
                });
            }


            // -------------------------------------------------
            // APPLICATION MUST BE APPROVED
            // -------------------------------------------------

            if (
                application.Status !=
                HostelApplicationStatus.Approved
            )
            {
                return BadRequest(new
                {
                    message =
                        "Application must be approved before assigning a room."
                });
            }


            // -------------------------------------------------
            // FIND ACTIVE ROOM
            // -------------------------------------------------

            var room =
                await _context.Rooms
                    .FirstOrDefaultAsync(
                        r =>
                            r.Id == roomId &&
                            r.HostelId ==
                                application.HostelId &&
                            r.IsActive
                    );


            if (room == null)
            {
                return NotFound(new
                {
                    message =
                        "Room not found."
                });
            }


            // -------------------------------------------------
            // CHECK ROOM CAPACITY
            // -------------------------------------------------

            var assignedCount =
                await _context.HostelApplications
                    .CountAsync(
                        h =>
                            h.RoomId == roomId &&
                            h.Status ==
                                HostelApplicationStatus.RoomAssigned
                    );


            if (
                assignedCount >=
                room.Capacity
            )
            {
                return BadRequest(new
                {
                    message =
                        "Room capacity is full."
                });
            }


            // -------------------------------------------------
            // ASSIGN ROOM
            // -------------------------------------------------

            application.RoomId = roomId;

            application.Status =
                HostelApplicationStatus.RoomAssigned;

            application.UpdatedAt =
                DateTime.UtcNow;


            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return Ok(new
            {
                message =
                    "Room assigned successfully.",

                application.Id,

                room.RoomNumber,

                roomId = room.Id
            });
        }
    }
}