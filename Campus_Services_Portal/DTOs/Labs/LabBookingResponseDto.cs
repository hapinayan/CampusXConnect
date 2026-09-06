namespace Campus_Services_Portal.DTOs.Labs
{
    public class LabBookingResponseDto
    {
        public int Id { get; set; }

        public int LabId { get; set; }

        public string LabName { get; set; } = string.Empty;

        public int StudentId { get; set; }

        public DateTime BookingDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}