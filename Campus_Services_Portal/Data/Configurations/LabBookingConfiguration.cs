using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class LabBookingConfiguration : IEntityTypeConfiguration<LabBooking>
    {
        public void Configure(EntityTypeBuilder<LabBooking> builder)
        {
            builder.HasKey(lb => lb.Id);

            builder.Property(lb => lb.BookingDate)
                .IsRequired();

            builder.Property(lb => lb.StartTime)
                .IsRequired();

            builder.Property(lb => lb.EndTime)
                .IsRequired();

            builder.Property(lb => lb.CreatedAt)
                .IsRequired();

            builder.HasOne(lb => lb.Lab)
                .WithMany(l => l.LabBookings)
                .HasForeignKey(lb => lb.LabId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(lb => lb.Student)
                .WithMany()
                .HasForeignKey(lb => lb.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Prevent exact duplicate lab booking time slots
            builder.HasIndex(lb => new
            {
                lb.LabId,
                lb.BookingDate,
                lb.StartTime,
                lb.EndTime
            })
            .IsUnique();
        }
    }
}
