using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class HostelApplicationConfiguration : IEntityTypeConfiguration<HostelApplication>
    {
        public void Configure(EntityTypeBuilder<HostelApplication> builder)
        {
            builder.HasKey(ha => ha.Id);

            builder.Property(ha => ha.Preferences)
                .HasMaxLength(500);

            builder.Property(ha => ha.Status)
                .IsRequired();

            builder.Property(ha => ha.AppliedAt)
                .IsRequired();

            builder.HasOne(ha => ha.Student)
                .WithMany()
                .HasForeignKey(ha => ha.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ha => ha.Hostel)
                .WithMany(h => h.HostelApplications)
                .HasForeignKey(ha => ha.HostelId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ha => ha.Room)
                .WithMany(r => r.HostelApplications)
                .HasForeignKey(ha => ha.RoomId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
