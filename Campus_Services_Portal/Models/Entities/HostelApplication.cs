using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Models.Entities
{
    public class HostelApplication
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int HostelId { get; set; }

        public int? RoomId { get; set; }

        public string Preferences { get; set; } = string.Empty;

        public HostelApplicationStatus Status { get; set; }
            = HostelApplicationStatus.Pending;

        public DateTime AppliedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relationships
        public Student Student { get; set; } = null!;

        public Hostel Hostel { get; set; } = null!;

        public Room? Room { get; set; }
    }
}
