using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class LabRepository : ILabRepository
    {
        private readonly CampusXDbContext _context;

        public LabRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Lab>> GetAllAsync()
        {
            return await _context.Labs
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Lab?> GetByIdAsync(int id)
        {
            return await _context.Labs
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task AddAsync(Lab lab)
        {
            await _context.Labs.AddAsync(lab);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Lab lab)
        {
            _context.Labs.Update(lab);
            await _context.SaveChangesAsync();
        }
    }
}