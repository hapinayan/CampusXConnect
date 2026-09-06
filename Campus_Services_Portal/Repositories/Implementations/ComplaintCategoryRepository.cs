using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class ComplaintCategoryRepository : IComplaintCategoryRepository
    {
        private readonly CampusXDbContext _context;

        public ComplaintCategoryRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ComplaintCategory>> GetAllAsync()
        {
            return await _context.ComplaintCategories
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<ComplaintCategory?> GetByIdAsync(int id)
        {
            return await _context.ComplaintCategories
                .FirstOrDefaultAsync(c => c.Id == id);
        }
    }
}