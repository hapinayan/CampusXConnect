namespace Campus_Services_Portal.Models.Entities
{
    public class Student
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string IndexNumber { get; set; } = string.Empty;

        public string FullName { get; set; } = string.Empty;

        public string Faculty { get; set; } = string.Empty;

        public string ContactNumber { get; set; } = string.Empty;

        // Relationship with User
        public User User { get; set; } = null!;
    }
}
