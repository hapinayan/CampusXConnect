using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly CampusXDbContext _context;

        public NotificationRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Notification>> GetByStudentIdAsync(
            int studentId)
        {
            return await _context.Notifications
                .Where(n => n.StudentId == studentId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Notification notification)
        {
            _context.Notifications.Update(notification);
            await _context.SaveChangesAsync();
        }
    }
}