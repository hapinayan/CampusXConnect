namespace Campus_Services_Portal.Models.Entities
{
    public class EventRegistration
    {
        public int Id { get; set; }

        public int EventId { get; set; }

        public int StudentId { get; set; }

        public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Event Event { get; set; } = null!;

        public Student Student { get; set; } = null!;
    }
}