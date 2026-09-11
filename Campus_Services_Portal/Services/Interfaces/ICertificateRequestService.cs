using Campus_Services_Portal.DTOs.Certificates;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface ICertificateRequestService
    {
        Task<CertificateRequestResponseDto> CreateRequestAsync(
            int studentId,
            CreateCertificateRequestDto dto);

        Task<IEnumerable<CertificateRequestResponseDto>>
            GetStudentRequestsAsync(int studentId);

        Task<IEnumerable<CertificateRequestResponseDto>>
            GetAllRequestsAsync(CertificateRequestStatus? status);

        Task<CertificateRequestResponseDto>
            UpdateStatusAsync(
                int id,
                UpdateCertificateStatusDto dto);
    }
}