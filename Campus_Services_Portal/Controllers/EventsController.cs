using Campus_Services_Portal.DTOs.Events;
using Campus_Services_Portal.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Campus_Services_Portal.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEventById(int id)
        {
            var eventItem = await _eventService.GetEventByIdAsync(id);

            if (eventItem == null)
            {
                return NotFound(new { message = "Event not found." });
            }

            return Ok(eventItem);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEvent(CreateEventDto dto)
        {
            var eventItem = await _eventService.CreateEventAsync(dto);

            return CreatedAtAction(
                nameof(GetEventById),
                new { id = eventItem.Id },
                eventItem);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEvent(
            int id,
            UpdateEventDto dto)
        {
            var updated = await _eventService.UpdateEventAsync(id, dto);

            if (!updated)
            {
                return NotFound(new { message = "Event not found." });
            }

            return Ok(new { message = "Event updated successfully." });
        }
    }
}