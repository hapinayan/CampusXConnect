using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Events
{
    public class CreateEventRegistrationDto
    {
        [Required]
        public int EventId { get; set; }
    }
}
