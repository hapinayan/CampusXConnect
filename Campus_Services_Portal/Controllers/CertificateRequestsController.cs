using Campus_Services_Portal.DTOs.Certificates;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Security;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/certificate-requests")]
    [Authorize]
    public class CertificateRequestsController : ControllerBase
    {
        private readonly ICertificateRequestService
            _certificateRequestService;

        private readonly CurrentUserService
            _currentUserService;

        public CertificateRequestsController(
            ICertificateRequestService certificateRequestService,
            CurrentUserService currentUserService)
        {
            _certificateRequestService =
                certificateRequestService;

            _currentUserService =
                currentUserService;
        }

        // Student - Create certificate request
        [HttpPost]
        public async Task<IActionResult> CreateRequest(
            [FromBody] CreateCertificateRequestDto dto)
        {
            var studentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (studentId == null)
            {
                return Forbid();
            }

            try
            {
                var request =
                    await _certificateRequestService
                        .CreateRequestAsync(
                            studentId.Value,
                            dto);

                return StatusCode(
                    StatusCodes.Status201Created,
                    request);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // Student - View own certificate requests
        [HttpGet("my")]
        public async Task<IActionResult> GetMyRequests()
        {
            var studentId =
                await _currentUserService
                    .GetCurrentStudentIdAsync();

            if (studentId == null)
            {
                return Forbid();
            }

            var requests =
                await _certificateRequestService
                    .GetStudentRequestsAsync(
                        studentId.Value);

            return Ok(requests);
        }

        // Admin - View all certificate requests
        [HttpGet("admin")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllRequests(
            [FromQuery] CertificateRequestStatus? status)
        {
            try
            {
                var requests =
                    await _certificateRequestService
                        .GetAllRequestsAsync(status);

                return Ok(requests);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        // Admin - Update certificate request status
        [HttpPut("{id}/status")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(
            int id,
            [FromBody] UpdateCertificateStatusDto dto)
        {
            try
            {
                var request =
                    await _certificateRequestService
                        .UpdateStatusAsync(id, dto);

                return Ok(request);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new
                {
                    message = ex.Message
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}