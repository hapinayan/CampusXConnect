using Campus_Services_Portal.Data;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Repositories.Implementations;
using Campus_Services_Portal.Services.Interfaces;
using Campus_Services_Portal.Services.Implementations;
using Microsoft.EntityFrameworkCore;

namespace Campus_Services_Portal
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Database Connection
            builder.Services.AddDbContext<CampusXDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // Add Controllers
            builder.Services.AddControllers();

            // =========================
            // LAB MODULE
            // =========================

            // Lab Repositories
            builder.Services.AddScoped<ILabRepository, LabRepository>();
            builder.Services.AddScoped<ILabBookingRepository, LabBookingRepository>();

            // Lab Services
            builder.Services.AddScoped<ILabService, LabService>();
            builder.Services.AddScoped<ILabBookingService, LabBookingService>();


            // =========================
            // EVENT MODULE
            // =========================

            // Event Repositories
            builder.Services.AddScoped<IEventRepository, EventRepository>();
            builder.Services.AddScoped<IEventRegistrationRepository, EventRegistrationRepository>();

            // Event Services
            builder.Services.AddScoped<IEventService, EventService>();
            builder.Services.AddScoped<IEventRegistrationService, EventRegistrationService>();


            // =========================
            // NOTIFICATION MODULE
            // =========================

            // Notification Repository
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();

            // Notification Service
            builder.Services.AddScoped<INotificationService, NotificationService>();


            // Swagger / OpenAPI
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}