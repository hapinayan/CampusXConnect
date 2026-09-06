using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class EventRepository : IEventRepository
    {
        private readonly CampusXDbContext _context;

        public EventRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllAsync()
        {
            return await _context.Events
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Event?> GetByIdAsync(int id)
        {
            return await _context.Events
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task AddAsync(Event eventItem)
        {
            await _context.Events.AddAsync(eventItem);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Event eventItem)
        {
            _context.Events.Update(eventItem);
            await _context.SaveChangesAsync();
        }
    }
}