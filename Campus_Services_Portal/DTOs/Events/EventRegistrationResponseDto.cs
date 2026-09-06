namespace Campus_Services_Portal.DTOs.Events
{
    public class EventRegistrationResponseDto
    {
        public int Id { get; set; }

        public int EventId { get; set; }

        public string EventTitle { get; set; } = string.Empty;

        public int StudentId { get; set; }

        public DateTime RegisteredAt { get; set; }
    }
}