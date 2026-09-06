using Campus_Services_Portal.DTOs.Events;
using Campus_Services_Portal.Security;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/event-registrations")]
    [Authorize]
    public class EventRegistrationsController : ControllerBase
    {
        private readonly IEventRegistrationService _eventRegistrationService;
        private readonly CurrentUserService _currentUserService;

        public EventRegistrationsController(
            IEventRegistrationService eventRegistrationService,
            CurrentUserService currentUserService)
        {
            _eventRegistrationService = eventRegistrationService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterForEvent(
            CreateEventRegistrationDto dto)
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
                var registration =
                    await _eventRegistrationService.RegisterForEventAsync(
                        studentId.Value,
                        dto);

                return Ok(registration);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Event not found.")
                {
                    return NotFound(
                        new { message = ex.Message });
                }

                if (ex.Message ==
                    "Student is already registered for this event.")
                {
                    return Conflict(
                        new { message = ex.Message });
                }

                if (ex.Message == "Event capacity is full.")
                {
                    return Conflict(
                        new { message = ex.Message });
                }

                return BadRequest(
                    new { message = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentRegistrations(
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

            var registrations =
                await _eventRegistrationService
                    .GetStudentRegistrationsAsync(studentId);

            return Ok(registrations);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelRegistration(int id)
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
                    await _eventRegistrationService
                        .CancelRegistrationAsync(
                            id,
                            studentId.Value);

                if (!cancelled)
                {
                    return NotFound(
                        new { message = "Registration not found." });
                }

                return Ok(
                    new
                    {
                        message =
                            "Event registration cancelled successfully."
                    });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
        }
    }
}