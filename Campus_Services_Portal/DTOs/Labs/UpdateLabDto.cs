using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Labs
{
    public class UpdateLabDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        public bool IsActive { get; set; }
    }
}