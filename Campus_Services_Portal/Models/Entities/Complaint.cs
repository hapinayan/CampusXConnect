using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Models.Entities
{
    public class Complaint
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int ComplaintCategoryId { get; set; }

        public string Description { get; set; } = string.Empty;

        public ComplaintStatus Status { get; set; }
            = ComplaintStatus.Pending;

        public string? ResolutionNote { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Relationships
        public Student Student { get; set; } = null!;

        public ComplaintCategory ComplaintCategory { get; set; } = null!;
    }
}