using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Campus_Services_Portal.Data.Configurations
{
    public class EventRegistrationConfiguration
        : IEntityTypeConfiguration<EventRegistration>
    {
        public void Configure(EntityTypeBuilder<EventRegistration> builder)
        {
            builder.HasKey(er => er.Id);

            builder.Property(er => er.RegisteredAt)
                .IsRequired();

            builder.HasOne(er => er.Event)
                .WithMany(e => e.EventRegistrations)
                .HasForeignKey(er => er.EventId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(er => er.Student)
                .WithMany()
                .HasForeignKey(er => er.StudentId)
                .OnDelete(DeleteBehavior.Restrict);

            // Same student cannot register for the same event twice
            builder.HasIndex(er => new
            {
                er.EventId,
                er.StudentId
            })
            .IsUnique();
        }
    }
}
