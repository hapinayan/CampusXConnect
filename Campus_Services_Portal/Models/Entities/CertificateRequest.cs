using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Models.Entities
{
    public class CertificateRequest
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public CertificateType Type { get; set; }

        public string Reason { get; set; } = string.Empty;

        public CertificateRequestStatus Status { get; set; }
            = CertificateRequestStatus.Pending;

        public DateTime RequestedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relationship
        public Student Student { get; set; } = null!;
    }
}