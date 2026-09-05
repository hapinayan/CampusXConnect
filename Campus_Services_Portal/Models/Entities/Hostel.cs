namespace Campus_Services_Portal.Models.Entities
{
    public class Hostel
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        // One Hostel can have many Rooms
        public ICollection<Room> Rooms { get; set; } = new List<Room>();

        // One Hostel can have many Applications
        public ICollection<HostelApplication> HostelApplications { get; set; }
            = new List<HostelApplication>();
    }
}
