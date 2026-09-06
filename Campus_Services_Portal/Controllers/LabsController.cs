using Campus_Services_Portal.DTOs.Labs;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LabsController : ControllerBase
    {
        private readonly ILabService _labService;

        public LabsController(ILabService labService)
        {
            _labService = labService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLabs()
        {
            var labs = await _labService.GetAllLabsAsync();
            return Ok(labs);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLabById(int id)
        {
            var lab = await _labService.GetLabByIdAsync(id);

            if (lab == null)
            {
                return NotFound(new { message = "Lab not found." });
            }

            return Ok(lab);
        }

        [HttpGet("{id}/slots")]
        public async Task<IActionResult> GetLabSlots(
            int id,
            [FromQuery] DateTime date)
        {
            try
            {
                var slots = await _labService.GetLabSlotsAsync(
                    id,
                    date);

                return Ok(slots);
            }
            catch (Exception ex)
            {
                if (ex.Message == "Lab not found.")
                {
                    return NotFound(
                        new { message = ex.Message });
                }

                return BadRequest(
                    new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateLab(CreateLabDto dto)
        {
            var lab = await _labService.CreateLabAsync(dto);

            return CreatedAtAction(
                nameof(GetLabById),
                new { id = lab.Id },
                lab);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLab(
            int id,
            UpdateLabDto dto)
        {
            var updated = await _labService.UpdateLabAsync(id, dto);

            if (!updated)
            {
                return NotFound(
                    new { message = "Lab not found." });
            }

            return Ok(
                new { message = "Lab updated successfully." });
        }
    }
}