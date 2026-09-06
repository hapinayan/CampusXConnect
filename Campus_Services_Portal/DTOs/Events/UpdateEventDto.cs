using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Events
{
    public class UpdateEventDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public DateTime EventDate { get; set; }

        [Required]
        public string Venue { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        public bool IsActive { get; set; }
    }
}