namespace Campus_Services_Portal.Models.Entities
{
    public class ComplaintCategory
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        // One Category can have many Complaints
        public ICollection<Complaint> Complaints { get; set; }
            = new List<Complaint>();
    }
}