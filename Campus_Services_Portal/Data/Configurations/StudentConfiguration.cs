using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.IndexNumber)
                .IsRequired()
                .HasMaxLength(50);

            builder.HasIndex(s => s.IndexNumber)
                .IsUnique();

            builder.Property(s => s.FullName)
                .IsRequired()
                .HasMaxLength(150);

            builder.Property(s => s.Faculty)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(s => s.ContactNumber)
                .IsRequired()
                .HasMaxLength(20);

            builder.HasIndex(s => s.UserId)
                .IsUnique();
        }
    }
}
