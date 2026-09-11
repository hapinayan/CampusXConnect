using Campus_Services_Portal.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/admin/students")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminStudentsController : ControllerBase
    {
        private readonly CampusXDbContext _context;

        public AdminStudentsController(CampusXDbContext context)
        {
            _context = context;
        }

        // =========================================
        // GET ALL STUDENTS
        // GET: api/admin/students
        // =========================================
        [HttpGet]
        public async Task<IActionResult> GetAllStudents()
        {
            var students = await _context.Students
                .Include(s => s.User)
                .Select(s => new
                {
                    s.Id,
                    s.UserId,
                    s.IndexNumber,
                    s.FullName,
                    Email = s.User.Email,
                    s.Faculty,
                    s.ContactNumber,
                    IsActive = s.User.IsActive
                })
                .ToListAsync();

            return Ok(students);
        }


        // =========================================
        // GET STUDENT BY ID
        // GET: api/admin/students/1
        // =========================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentById(int id)
        {
            var student = await _context.Students
                .Include(s => s.User)
                .Where(s => s.Id == id)
                .Select(s => new
                {
                    s.Id,
                    s.UserId,
                    s.IndexNumber,
                    s.FullName,
                    Email = s.User.Email,
                    s.Faculty,
                    s.ContactNumber,
                    IsActive = s.User.IsActive
                })
                .FirstOrDefaultAsync();

            if (student == null)
            {
                return NotFound(new
                {
                    message = "Student not found."
                });
            }

            return Ok(student);
        }
    }
}