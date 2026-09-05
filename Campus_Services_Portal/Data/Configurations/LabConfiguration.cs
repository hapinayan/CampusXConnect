using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class LabConfiguration : IEntityTypeConfiguration<Lab>
    {
        public void Configure(EntityTypeBuilder<Lab> builder)
        {
            builder.HasKey(l => l.Id);

            builder.Property(l => l.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(l => l.Location)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(l => l.Capacity)
                .IsRequired();

            builder.Property(l => l.IsActive)
                .HasDefaultValue(true);

            builder.HasMany(l => l.LabBookings)
                .WithOne(lb => lb.Lab)
                .HasForeignKey(lb => lb.LabId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
