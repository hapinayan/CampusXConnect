using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Repositories.Interfaces
{
    public interface ICertificateRequestRepository
    {
        Task<IEnumerable<CertificateRequest>> GetAllAsync();

        Task<IEnumerable<CertificateRequest>> GetByStudentIdAsync(
            int studentId);

        Task<CertificateRequest?> GetByIdAsync(int id);

        Task<bool> HasPendingRequestAsync(
            int studentId,
            CertificateType type);

        Task AddAsync(CertificateRequest certificateRequest);

        Task UpdateAsync(CertificateRequest certificateRequest);
    }
}