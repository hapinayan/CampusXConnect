using Campus_Services_Portal.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Certificates
{
    public class UpdateCertificateStatusDto
    {
        [Required]
        public CertificateRequestStatus Status { get; set; }
    }
}