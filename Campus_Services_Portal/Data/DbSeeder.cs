using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(CampusXDbContext context)
        {
            await context.Database.MigrateAsync();

            // =========================
            // SEED ADMIN USER
            // =========================
            if (!await context.Users.AnyAsync(u => u.Role == UserRole.Admin))
            {
                var adminUser = new User
                {
                    Email = "admin@campusx.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(adminUser);
                await context.SaveChangesAsync();
            }

            // =========================
            // SEED HOSTEL + ROOMS
            // =========================
            if (!await context.Hostels.AnyAsync())
            {
                var hostel = new Hostel
                {
                    Name = "Main Hostel",
                    Location = "Campus North Block"
                };

                hostel.Rooms.Add(new Room
                {
                    RoomNumber = "A101",
                    Capacity = 2,
                    IsActive = true
                });

                hostel.Rooms.Add(new Room
                {
                    RoomNumber = "A102",
                    Capacity = 3,
                    IsActive = true
                });

                context.Hostels.Add(hostel);

                await context.SaveChangesAsync();
            }

            // =========================
            // SEED COMPLAINT CATEGORIES
            // =========================
            if (!await context.ComplaintCategories.AnyAsync())
            {
                var categories = new List<ComplaintCategory>
                {
                    new ComplaintCategory
                    {
                        Name = "Academic"
                    },
                    new ComplaintCategory
                    {
                        Name = "Hostel"
                    },
                    new ComplaintCategory
                    {
                        Name = "Laboratory"
                    },
                    new ComplaintCategory
                    {
                        Name = "Facilities"
                    },
                    new ComplaintCategory
                    {
                        Name = "Other"
                    }
                };

                context.ComplaintCategories.AddRange(categories);

                await context.SaveChangesAsync();
            }
        }
    }
}