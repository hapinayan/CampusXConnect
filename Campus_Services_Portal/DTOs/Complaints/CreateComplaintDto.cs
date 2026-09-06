using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Complaints
{
    public class CreateComplaintDto
    {
        [Required]
        public int CategoryId { get; set; }

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
    }
}