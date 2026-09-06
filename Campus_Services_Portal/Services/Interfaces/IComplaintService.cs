using Campus_Services_Portal.DTOs.Complaints;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface IComplaintService
    {
        Task<ComplaintResponseDto> CreateComplaintAsync(
            int studentId,
            CreateComplaintDto dto);

        Task<IEnumerable<ComplaintResponseDto>> GetStudentComplaintsAsync(
            int studentId);

        Task<IEnumerable<ComplaintResponseDto>> GetAllComplaintsAsync(
            ComplaintStatus? status);

        Task<ComplaintResponseDto> UpdateComplaintStatusAsync(
            int complaintId,
            UpdateComplaintStatusDto dto);
    }
}