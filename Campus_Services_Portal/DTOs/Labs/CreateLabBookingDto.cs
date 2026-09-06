using System.ComponentModel.DataAnnotations;

namespace Campus_Services_Portal.DTOs.Labs
{
    public class CreateLabBookingDto
    {
        [Required]
        public int LabId { get; set; }

        [Required]
        public DateTime BookingDate { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }
    }
}