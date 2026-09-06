using System.Security.Claims;
using Campus_Services_Portal.DTOs.Events;
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

        public EventRegistrationsController(
            IEventRegistrationService eventRegistrationService)
        {
            _eventRegistrationService = eventRegistrationService;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterForEvent(
            CreateEventRegistrationDto dto)
        {
            var studentId = GetCurrentStudentId();

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

            var registrations =
                await _eventRegistrationService
                    .GetStudentRegistrationsAsync(studentId);

            return Ok(registrations);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelRegistration(int id)
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

        private int? GetCurrentStudentId()
        {
            var claim = User.FindFirst(
                ClaimTypes.NameIdentifier);

            if (claim == null)
            {
                return null;
            }

            if (!int.TryParse(
                claim.Value,
                out var studentId))
            {
                return null;
            }

            return studentId;
        }
    }
}