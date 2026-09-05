using Campus_Services_Portal.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Data
{
    public class CampusXDbContext : DbContext
    {
        public CampusXDbContext(DbContextOptions<CampusXDbContext> options)
            : base(options)
        {
        }

        

        public DbSet<User> Users { get; set; }

        public DbSet<Student> Students { get; set; }

        public DbSet<Hostel> Hostels { get; set; }

        public DbSet<Room> Rooms { get; set; }

        public DbSet<HostelApplication> HostelApplications { get; set; }

        public DbSet<Lab> Labs { get; set; }

        public DbSet<LabBooking> LabBookings { get; set; }

        public DbSet<Event> Events { get; set; }

        public DbSet<EventRegistration> EventRegistrations { get; set; }

        public DbSet<ComplaintCategory> ComplaintCategories { get; set; }

        public DbSet<Complaint> Complaints { get; set; }

        public DbSet<CertificateRequest> CertificateRequests { get; set; }

        public DbSet<FeePayment> FeePayments { get; set; }

        public DbSet<Notification> Notifications { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CampusXDbContext).Assembly);
        }
    }
}