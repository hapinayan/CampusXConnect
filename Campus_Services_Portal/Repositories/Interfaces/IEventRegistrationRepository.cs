using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface IEventRegistrationRepository
    {
        Task<EventRegistration?> GetByIdAsync(int id);

        Task<IEnumerable<EventRegistration>> GetByStudentIdAsync(
            int studentId);

        Task<bool> IsStudentRegisteredAsync(
            int eventId,
            int studentId);

        Task<int> GetRegistrationCountAsync(
            int eventId);

        Task AddAsync(EventRegistration registration);

        Task DeleteAsync(EventRegistration registration);
    }
}
