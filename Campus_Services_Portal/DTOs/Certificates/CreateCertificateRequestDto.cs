using Campus_Services_Portal.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Certificates
{
    public class CreateCertificateRequestDto
    {
        [Required]
        public CertificateType Type { get; set; }

        [Required]
        [StringLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}