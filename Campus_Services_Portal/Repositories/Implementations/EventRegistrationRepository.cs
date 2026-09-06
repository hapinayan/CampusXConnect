using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class EventRegistrationRepository : IEventRegistrationRepository
    {
        private readonly CampusXDbContext _context;

        public EventRegistrationRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<EventRegistration?> GetByIdAsync(int id)
        {
            return await _context.EventRegistrations
                .Include(er => er.Event)
                .FirstOrDefaultAsync(er => er.Id == id);
        }

        public async Task<IEnumerable<EventRegistration>> GetByStudentIdAsync(
            int studentId)
        {
            return await _context.EventRegistrations
                .Include(er => er.Event)
                .Where(er => er.StudentId == studentId)
                .OrderBy(er => er.Event.EventDate)
                .ToListAsync();
        }

        public async Task<bool> IsStudentRegisteredAsync(
            int eventId,
            int studentId)
        {
            return await _context.EventRegistrations
                .AnyAsync(er =>
                    er.EventId == eventId &&
                    er.StudentId == studentId);
        }

        public async Task<int> GetRegistrationCountAsync(
            int eventId)
        {
            return await _context.EventRegistrations
                .CountAsync(er => er.EventId == eventId);
        }

        public async Task AddAsync(EventRegistration registration)
        {
            await _context.EventRegistrations.AddAsync(registration);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(EventRegistration registration)
        {
            _context.EventRegistrations.Remove(registration);
            await _context.SaveChangesAsync();
        }
    }
}