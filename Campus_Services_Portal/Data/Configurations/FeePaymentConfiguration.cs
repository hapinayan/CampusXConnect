using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class FeePaymentConfiguration
        : IEntityTypeConfiguration<FeePayment>
    {
        public void Configure(EntityTypeBuilder<FeePayment> builder)
        {
            builder.HasKey(fp => fp.Id);

            builder.Property(fp => fp.FeeType)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(fp => fp.Amount)
                .IsRequired()
                .HasPrecision(18, 2);

            builder.Property(fp => fp.Status)
                .IsRequired();

            builder.Property(fp => fp.ReceiptNumber)
                .HasMaxLength(100);

            builder.HasOne(fp => fp.Student)
                .WithMany()
                .HasForeignKey(fp => fp.StudentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}