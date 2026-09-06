using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface ILabRepository
    {
        Task<IEnumerable<Lab>> GetAllAsync();

        Task<Lab?> GetByIdAsync(int id);

        Task AddAsync(Lab lab);

        Task UpdateAsync(Lab lab);
    }
}