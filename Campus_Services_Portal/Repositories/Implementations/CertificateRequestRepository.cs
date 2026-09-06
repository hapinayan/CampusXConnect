using Campus_Services_Portal.Data;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Repositories.Implementations
{
    public class CertificateRequestRepository
        : ICertificateRequestRepository
    {
        private readonly CampusXDbContext _context;

        public CertificateRequestRepository(
            CampusXDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CertificateRequest>>
            GetAllAsync()
        {
            return await _context.CertificateRequests
                .Include(c => c.Student)
                .OrderByDescending(c => c.RequestedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<CertificateRequest>>
            GetByStudentIdAsync(int studentId)
        {
            return await _context.CertificateRequests
                .Include(c => c.Student)
                .Where(c => c.StudentId == studentId)
                .OrderByDescending(c => c.RequestedAt)
                .ToListAsync();
        }

        public async Task<CertificateRequest?> GetByIdAsync(
            int id)
        {
            return await _context.CertificateRequests
                .Include(c => c.Student)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<bool> HasPendingRequestAsync(
            int studentId,
            CertificateType type)
        {
            return await _context.CertificateRequests
                .AnyAsync(c =>
                    c.StudentId == studentId &&
                    c.Type == type &&
                    c.Status == CertificateRequestStatus.Pending);
        }

        public async Task AddAsync(
            CertificateRequest certificateRequest)
        {
            await _context.CertificateRequests
                .AddAsync(certificateRequest);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(
            CertificateRequest certificateRequest)
        {
            _context.CertificateRequests
                .Update(certificateRequest);

            await _context.SaveChangesAsync();
        }
    }
}