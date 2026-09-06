using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface IComplaintCategoryRepository
    {
        Task<IEnumerable<ComplaintCategory>> GetAllAsync();

        Task<ComplaintCategory?> GetByIdAsync(int id);
    }
}