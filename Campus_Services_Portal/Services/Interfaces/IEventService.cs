using Campus_Services_Portal.DTOs.Events;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventResponseDto>> GetAllEventsAsync();

        Task<EventResponseDto?> GetEventByIdAsync(int id);

        Task<EventResponseDto> CreateEventAsync(CreateEventDto dto);

        Task<bool> UpdateEventAsync(int id, UpdateEventDto dto);
    }
}