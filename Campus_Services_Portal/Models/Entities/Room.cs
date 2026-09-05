namespace Campus_Services_Portal.Models.Entities
{
    public class Room
    {
        public int Id { get; set; }

        public int HostelId { get; set; }

        public string RoomNumber { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public bool IsActive { get; set; } = true;

        // Relationship with Hostel
        public Hostel Hostel { get; set; } = null!;

        // One Room can be assigned to many hostel applications over time
        public ICollection<HostelApplication> HostelApplications { get; set; }
            = new List<HostelApplication>();
    }
}
