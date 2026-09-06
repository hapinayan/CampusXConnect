using Campus_Services_Portal.Data;
using Campus_Services_Portal.DTOs.Auth;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly CampusXDbContext _context;
        private readonly JwtTokenService _jwtTokenService;

        public AuthController(
            CampusXDbContext context,
            JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterStudentDto dto)
        {
            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (emailExists)
            {
                return BadRequest(new
                {
                    message = "Email already exists."
                });
            }

            var indexExists = await _context.Students
                .AnyAsync(s => s.IndexNumber == dto.IndexNumber);

            if (indexExists)
            {
                return BadRequest(new
                {
                    message = "Index number already exists."
                });
            }

            var user = new User
            {
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = UserRole.Student,
                IsActive = true
            };

            var student = new Student
            {
                IndexNumber = dto.IndexNumber,
                FullName = dto.FullName,
                Faculty = dto.Faculty,
                ContactNumber = dto.ContactNumber,
                User = user
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Student registered successfully."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password."
                });
            }

            if (!user.IsActive)
            {
                return Unauthorized(new
                {
                    message = "User account is inactive."
                });
            }

            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new
            {
                message = "Login successful.",
                token,
                role = user.Role.ToString()
            });
        }
    }
}