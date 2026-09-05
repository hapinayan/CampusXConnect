namespace Campus_Services_Portal.Models.Entities
{
    public class Lab
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Location { get; set; } = string.Empty;

        public int Capacity { get; set; }

        public bool IsActive { get; set; } = true;

        // One Lab can have many bookings
        public ICollection<LabBooking> LabBookings { get; set; }
            = new List<LabBooking>();
    }
}
