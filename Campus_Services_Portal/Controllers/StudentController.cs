using Campus_Services_Portal.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public StudentController(CampusXDbContext context)
        {
            _context = context;
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
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
                    message = "Student profile not found."
                });
            }

            return Ok(new
            {
                student.Id,
                student.IndexNumber,
                student.FullName,
                student.User.Email,
                student.Faculty,
                student.ContactNumber
            });
        }
    }
}