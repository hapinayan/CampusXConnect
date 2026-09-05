using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class ComplaintCategoryConfiguration
        : IEntityTypeConfiguration<ComplaintCategory>
    {
        public void Configure(EntityTypeBuilder<ComplaintCategory> builder)
        {
            builder.HasKey(cc => cc.Id);

            builder.Property(cc => cc.Name)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(cc => cc.IsActive)
                .HasDefaultValue(true);

            // Complaint category names must be unique
            builder.HasIndex(cc => cc.Name)
                .IsUnique();

            builder.HasMany(cc => cc.Complaints)
                .WithOne(c => c.ComplaintCategory)
                .HasForeignKey(c => c.ComplaintCategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
