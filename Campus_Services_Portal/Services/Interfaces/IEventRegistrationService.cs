using Campus_Services_Portal.DTOs.Events;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface IEventRegistrationService
    {
        Task<EventRegistrationResponseDto> RegisterForEventAsync(
            int studentId,
            CreateEventRegistrationDto dto);

        Task<IEnumerable<EventRegistrationResponseDto>> GetStudentRegistrationsAsync(
            int studentId);

        Task<bool> CancelRegistrationAsync(
            int registrationId,
            int studentId);
    }
}