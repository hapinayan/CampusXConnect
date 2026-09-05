using Campus_Services_Portal.Models.Enums;

namespace Campus_Services_Portal.Models.Entities
{
    public class FeePayment
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public string FeeType { get; set; } = string.Empty;

        public decimal Amount { get; set; }

        public PaymentStatus Status { get; set; }
            = PaymentStatus.Pending;

        public DateTime? PaidAt { get; set; }

        public string? ReceiptNumber { get; set; }

        // Relationship
        public Student Student { get; set; } = null!;
    }
}