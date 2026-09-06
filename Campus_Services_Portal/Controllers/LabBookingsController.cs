using Campus_Services_Portal.DTOs.Labs;
using Campus_Services_Portal.Security;
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
        private readonly CurrentUserService _currentUserService;

        public LabBookingsController(
            ILabBookingService labBookingService,
            CurrentUserService currentUserService)
        {
            _labBookingService = labBookingService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBooking(
            CreateLabBookingDto dto)
        {
            var studentId =
                await _currentUserService.GetCurrentStudentIdAsync();

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
                if (ex.Message == "Lab not found.")
                {
                    return NotFound(
                        new { message = ex.Message });
                }

                if (ex.Message ==
                    "This lab slot is already booked.")
                {
                    return Conflict(
                        new { message = ex.Message });
                }

                return BadRequest(
                    new { message = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentBookings(
            int studentId)
        {
            var currentStudentId =
                await _currentUserService.GetCurrentStudentIdAsync();

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
                await _labBookingService
                    .GetStudentBookingsAsync(studentId);

            return Ok(bookings);
        }

        [HttpGet("student/{studentId}/upcoming")]
        public async Task<IActionResult> GetUpcomingBookings(
            int studentId)
        {
            var currentStudentId =
                await _currentUserService.GetCurrentStudentIdAsync();

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
                await _labBookingService
                    .GetUpcomingBookingsAsync(studentId);

            return Ok(bookings);
        }

        [HttpGet("student/{studentId}/past")]
        public async Task<IActionResult> GetPastBookings(
            int studentId)
        {
            var currentStudentId =
                await _currentUserService.GetCurrentStudentIdAsync();

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
                await _labBookingService
                    .GetPastBookingsAsync(studentId);

            return Ok(bookings);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            var studentId =
                await _currentUserService.GetCurrentStudentIdAsync();

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
                    new
                    {
                        message =
                            "Booking cancelled successfully."
                    });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}