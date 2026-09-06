using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class ComplaintRepository : IComplaintRepository
    {
        private readonly CampusXDbContext _context;

        public ComplaintRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Complaint>> GetAllAsync()
        {
            return await _context.Complaints
                .Include(c => c.Student)
                .Include(c => c.ComplaintCategory)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Complaint>> GetByStudentIdAsync(int studentId)
        {
            return await _context.Complaints
                .Include(c => c.Student)
                .Include(c => c.ComplaintCategory)
                .Where(c => c.StudentId == studentId)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Complaint>> GetByStatusAsync(
            ComplaintStatus status)
        {
            return await _context.Complaints
                .Include(c => c.Student)
                .Include(c => c.ComplaintCategory)
                .Where(c => c.Status == status)
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Complaint?> GetByIdAsync(int id)
        {
            return await _context.Complaints
                .Include(c => c.Student)
                .Include(c => c.ComplaintCategory)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task AddAsync(Complaint complaint)
        {
            await _context.Complaints.AddAsync(complaint);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Complaint complaint)
        {
            _context.Complaints.Update(complaint);
            await _context.SaveChangesAsync();
        }
    }
}