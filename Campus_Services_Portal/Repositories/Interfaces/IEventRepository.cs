
using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface IEventRepository
    {
        Task<IEnumerable<Event>> GetAllAsync();

        Task<Event?> GetByIdAsync(int id);

        Task AddAsync(Event eventItem);

        Task UpdateAsync(Event eventItem);
    }
}


