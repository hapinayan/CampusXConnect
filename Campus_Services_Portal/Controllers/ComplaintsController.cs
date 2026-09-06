using Campus_Services_Portal.DTOs.Complaints;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Security;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/complaints")]
    [Authorize]
    public class ComplaintsController : ControllerBase
    {
        private readonly IComplaintService _complaintService;
        private readonly CurrentUserService _currentUserService;

        public ComplaintsController(
            IComplaintService complaintService,
            CurrentUserService currentUserService)
        {
            _complaintService = complaintService;
            _currentUserService = currentUserService;
        }

        // Student - Create complaint
        [HttpPost]
        public async Task<IActionResult> CreateComplaint(
            [FromBody] CreateComplaintDto dto)
        {
            var studentId =
                await _currentUserService.GetCurrentStudentIdAsync();

            if (studentId == null)
            {
                return Unauthorized();
            }

            try
            {
                var complaint =
                    await _complaintService.CreateComplaintAsync(
                        studentId.Value,
                        dto);

                return StatusCode(
                    StatusCodes.Status201Created,
                    complaint);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // Student - View own complaints
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentComplaints(int studentId)
        {
            var currentStudentId =
                await _currentUserService.GetCurrentStudentIdAsync();

            if (currentStudentId == null)
            {
                return Unauthorized();
            }

            if (currentStudentId.Value != studentId)
            {
                return Forbid();
            }

            var complaints =
                await _complaintService.GetStudentComplaintsAsync(studentId);

            return Ok(complaints);
        }

        // Admin - View all complaints / filter by status
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllComplaints(
            [FromQuery] ComplaintStatus? status)
        {
            var complaints =
                await _complaintService.GetAllComplaintsAsync(status);

            return Ok(complaints);
        }

        // Admin - Update complaint status and resolution note
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateComplaintStatus(
            int id,
            [FromBody] UpdateComplaintStatusDto dto)
        {
            try
            {
                var complaint =
                    await _complaintService.UpdateComplaintStatusAsync(
                        id,
                        dto);

                return Ok(complaint);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
        }
    }
}