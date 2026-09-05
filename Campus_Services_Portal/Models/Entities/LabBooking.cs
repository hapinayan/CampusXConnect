namespace Campus_Services_Portal.Models.Entities
{
    public class LabBooking
    {
        public int Id { get; set; }

        public int LabId { get; set; }

        public int StudentId { get; set; }

        public DateTime BookingDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Lab Lab { get; set; } = null!;

        public Student Student { get; set; } = null!;
    }
}
