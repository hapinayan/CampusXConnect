using System.Security.Claims;
using Campus_Services_Portal.DTOs.Labs;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/lab-bookings")]
    [Authorize]
    public class LabBookingsController : ControllerBase
    {
        private readonly ILabBookingService _labBookingService;

        public LabBookingsController(
            ILabBookingService labBookingService)
        {
            _labBookingService = labBookingService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking(
            CreateLabBookingDto dto)
        {
            var studentId = GetCurrentStudentId();

            if (studentId == null)
            {
                return Unauthorized(
                    new { message = "Invalid student identity." });
            }

            try
            {
                var booking =
                    await _labBookingService.CreateBookingAsync(
                        studentId.Value,
                        dto);

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentBookings(
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

            var bookings =
                await _labBookingService.GetStudentBookingsAsync(
                    studentId);

            return Ok(bookings);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var studentId = GetCurrentStudentId();

            if (studentId == null)
            {
                return Unauthorized(
                    new { message = "Invalid student identity." });
            }

            try
            {
                var cancelled =
                    await _labBookingService.CancelBookingAsync(
                        id,
                        studentId.Value);

                if (!cancelled)
                {
                    return NotFound(
                        new { message = "Booking not found." });
                }

                return Ok(
                    new { message = "Booking cancelled successfully." });
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