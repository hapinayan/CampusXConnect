using Campus_Services_Portal.DTOs.Labs;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface ILabService
    {
        Task<IEnumerable<LabResponseDto>> GetAllLabsAsync();

        Task<LabResponseDto?> GetLabByIdAsync(int id);

        Task<LabResponseDto> CreateLabAsync(CreateLabDto dto);

        Task<bool> UpdateLabAsync(int id, UpdateLabDto dto);

        Task<IEnumerable<LabBookingResponseDto>>
            GetLabSlotsAsync(int labId, DateTime date);
    }
}