using Campus_Services_Portal.Models.Entities;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface ILabBookingRepository
    {
        Task<IEnumerable<LabBooking>> GetByStudentIdAsync(int studentId);

        Task<LabBooking?> GetByIdAsync(int id);

        Task<IEnumerable<LabBooking>> GetByLabAndDateAsync(
            int labId,
            DateTime bookingDate);

        Task<bool> IsSlotBookedAsync(
            int labId,
            DateTime bookingDate,
            TimeSpan startTime,
            TimeSpan endTime);

        Task AddAsync(LabBooking booking);

        Task DeleteAsync(LabBooking booking);
    }
}