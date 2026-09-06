using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface INotificationRepository
    {
        Task<IEnumerable<Notification>> GetByStudentIdAsync(int studentId);

        Task<Notification?> GetByIdAsync(int id);

        Task AddAsync(Notification notification);

        Task UpdateAsync(Notification notification);
    }
}