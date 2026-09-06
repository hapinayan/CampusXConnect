using Campus_Services_Portal.DTOs.Events;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;

        public EventService(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<EventResponseDto>> GetAllEventsAsync()
        {
            var events = await _eventRepository.GetAllAsync();

            return events.Select(eventItem => new EventResponseDto
            {
                Id = eventItem.Id,
                Title = eventItem.Title,
                Description = eventItem.Description,
                EventDate = eventItem.EventDate,
                Venue = eventItem.Venue,
                Capacity = eventItem.Capacity,
                IsActive = eventItem.IsActive
            });
        }

        public async Task<EventResponseDto?> GetEventByIdAsync(int id)
        {
            var eventItem = await _eventRepository.GetByIdAsync(id);

            if (eventItem == null)
            {
                return null;
            }

            return new EventResponseDto
            {
                Id = eventItem.Id,
                Title = eventItem.Title,
                Description = eventItem.Description,
                EventDate = eventItem.EventDate,
                Venue = eventItem.Venue,
                Capacity = eventItem.Capacity,
                IsActive = eventItem.IsActive
            };
        }

        public async Task<EventResponseDto> CreateEventAsync(CreateEventDto dto)
        {
            var eventItem = new Event
            {
                Title = dto.Title,
                Description = dto.Description,
                EventDate = dto.EventDate,
                Venue = dto.Venue,
                Capacity = dto.Capacity,
                IsActive = true
            };

            await _eventRepository.AddAsync(eventItem);

            return new EventResponseDto
            {
                Id = eventItem.Id,
                Title = eventItem.Title,
                Description = eventItem.Description,
                EventDate = eventItem.EventDate,
                Venue = eventItem.Venue,
                Capacity = eventItem.Capacity,
                IsActive = eventItem.IsActive
            };
        }

        public async Task<bool> UpdateEventAsync(int id, UpdateEventDto dto)
        {
            var eventItem = await _eventRepository.GetByIdAsync(id);

            if (eventItem == null)
            {
                return false;
            }

            eventItem.Title = dto.Title;
            eventItem.Description = dto.Description;
            eventItem.EventDate = dto.EventDate;
            eventItem.Venue = dto.Venue;
            eventItem.Capacity = dto.Capacity;
            eventItem.IsActive = dto.IsActive;

            await _eventRepository.UpdateAsync(eventItem);

            return true;
        }
    }
}