using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class LabBookingRepository : ILabBookingRepository
    {
        private readonly CampusXDbContext _context;

        public LabBookingRepository(CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LabBooking>>
            GetByStudentIdAsync(int studentId)
        {
            return await _context.LabBookings
                .Include(lb => lb.Lab)
                .Where(lb => lb.StudentId == studentId)
                .OrderBy(lb => lb.BookingDate)
                .ThenBy(lb => lb.StartTime)
                .ToListAsync();
        }

        public async Task<LabBooking?> GetByIdAsync(int id)
        {
            return await _context.LabBookings
                .Include(lb => lb.Lab)
                .FirstOrDefaultAsync(lb => lb.Id == id);
        }

        public async Task<IEnumerable<LabBooking>>
            GetByLabAndDateAsync(
                int labId,
                DateTime bookingDate)
        {
            var date = bookingDate.Date;

            return await _context.LabBookings
                .Where(lb =>
                    lb.LabId == labId &&
                    lb.BookingDate.Date == date)
                .OrderBy(lb => lb.StartTime)
                .ToListAsync();
        }

        public async Task<bool> IsSlotBookedAsync(
            int labId,
            DateTime bookingDate,
            TimeSpan startTime,
            TimeSpan endTime)
        {
            var date = bookingDate.Date;

            return await _context.LabBookings
                .AnyAsync(lb =>
                    lb.LabId == labId &&
                    lb.BookingDate.Date == date &&
                    startTime < lb.EndTime &&
                    endTime > lb.StartTime);
        }

        public async Task AddAsync(LabBooking booking)
        {
            await _context.LabBookings.AddAsync(booking);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(LabBooking booking)
        {
            _context.LabBookings.Remove(booking);
            await _context.SaveChangesAsync();
        }
    }
}