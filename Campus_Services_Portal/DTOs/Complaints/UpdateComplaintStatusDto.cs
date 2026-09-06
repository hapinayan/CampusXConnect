using System.ComponentModel.DataAnnotations;
using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.DTOs.Complaints
{
    public class UpdateComplaintStatusDto
    {
        [Required]
        public ComplaintStatus Status { get; set; }

        [StringLength(1000)]
        public string? ResolutionNote { get; set; }
    }
}