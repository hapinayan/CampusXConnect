using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface IComplaintRepository
    {
        Task<IEnumerable<Complaint>> GetAllAsync();

        Task<IEnumerable<Complaint>> GetByStudentIdAsync(int studentId);

        Task<IEnumerable<Complaint>> GetByStatusAsync(ComplaintStatus status);

        Task<Complaint?> GetByIdAsync(int id);

        Task AddAsync(Complaint complaint);

        Task UpdateAsync(Complaint complaint);
    }
}