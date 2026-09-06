namespace Campus_Services_Portal.DTOs.Certificates
{
    public class CertificateRequestResponseDto
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public string StudentName { get; set; } = string.Empty;

        public string Type { get; set; } = string.Empty;

        public string Reason { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public DateTime RequestedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}