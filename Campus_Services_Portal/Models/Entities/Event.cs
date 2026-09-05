namespace Campus_Services_Portal.Models.Entities
{
    public class Event
    {
        public int Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime EventDate { get; set; }

        public string Venue { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public bool IsActive { get; set; } = true;

        // One Event can have many registrations
        public ICollection<EventRegistration> EventRegistrations { get; set; }
            = new List<EventRegistration>();
    }
}
