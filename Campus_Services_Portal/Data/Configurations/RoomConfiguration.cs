using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.HasKey(r => r.Id);

            builder.Property(r => r.RoomNumber)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(r => r.Capacity)
                .IsRequired();

            builder.Property(r => r.IsActive)
                .HasDefaultValue(true);

            // Same hostel cannot have duplicate room numbers
            builder.HasIndex(r => new { r.HostelId, r.RoomNumber })
                .IsUnique();

            builder.HasMany(r => r.HostelApplications)
                .WithOne(ha => ha.Room)
                .HasForeignKey(ha => ha.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
