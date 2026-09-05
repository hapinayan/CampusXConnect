using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class CertificateRequestConfiguration
        : IEntityTypeConfiguration<CertificateRequest>
    {
        public void Configure(EntityTypeBuilder<CertificateRequest> builder)
        {
            builder.HasKey(cr => cr.Id);

            builder.Property(cr => cr.Type)
                .IsRequired();

            builder.Property(cr => cr.Reason)
                .IsRequired()
                .HasMaxLength(500);

            builder.Property(cr => cr.Status)
                .IsRequired();

            builder.Property(cr => cr.RequestedAt)
                .IsRequired();

            builder.HasOne(cr => cr.Student)
                .WithMany()
                .HasForeignKey(cr => cr.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
