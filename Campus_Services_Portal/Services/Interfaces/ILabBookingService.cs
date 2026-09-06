using Campus_Services_Portal.DTOs.Labs;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface ILabBookingService
    {
        Task<LabBookingResponseDto> CreateBookingAsync(
            int studentId,
            CreateLabBookingDto dto);

        Task<IEnumerable<LabBookingResponseDto>> GetStudentBookingsAsync(
            int studentId);

        Task<bool> CancelBookingAsync(
            int bookingId,
            int studentId);
    }
}