using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class ComplaintConfiguration
        : IEntityTypeConfiguration<Complaint>
    {
        public void Configure(EntityTypeBuilder<Complaint> builder)
        {
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(1000);

            builder.Property(c => c.Status)
                .IsRequired();

            builder.Property(c => c.ResolutionNote)
                .HasMaxLength(1000);

            builder.Property(c => c.CreatedAt)
                .IsRequired();

            builder.HasOne(c => c.Student)
                .WithMany()
                .HasForeignKey(c => c.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.ComplaintCategory)
                .WithMany(cc => cc.Complaints)
                .HasForeignKey(c => c.ComplaintCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}