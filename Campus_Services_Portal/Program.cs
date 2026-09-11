using Campus_Services_Portal.Data;
using Campus_Services_Portal.Security;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Repositories.Implementations;
using Campus_Services_Portal.Services.Interfaces;
using Campus_Services_Portal.Services.Implementations;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Text;

namespace Campus_Services_Portal
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // =========================
            // DATABASE CONNECTION
            // =========================
            builder.Services.AddDbContext<CampusXDbContext>(options =>
                options.UseSqlServer(
                    builder.Configuration.GetConnectionString("DefaultConnection")));

            // =========================
            // JWT TOKEN SERVICE
            // =========================
            builder.Services.AddScoped<JwtTokenService>();

            // =========================
            // JWT AUTHENTICATION
            // =========================
            var jwtKey = builder.Configuration["Jwt:Key"];
            var jwtIssuer = builder.Configuration["Jwt:Issuer"];
            var jwtAudience = builder.Configuration["Jwt:Audience"];

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                    JwtBearerDefaults.AuthenticationScheme;

                options.DefaultChallengeScheme =
                    JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,

                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey!))
                };
            });

            // =========================
            // CONTROLLERS
            // =========================
            builder.Services.AddControllers();


            // =========================
            // CORS
            // =========================
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy
                        .WithOrigins("http://localhost:4200")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });



            // =========================
            // CURRENT USER SERVICE
            // =========================
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<CurrentUserService>();

            // =========================
            // LAB MODULE
            // =========================
            builder.Services.AddScoped<ILabRepository, LabRepository>();
            builder.Services.AddScoped<ILabBookingRepository, LabBookingRepository>();

            builder.Services.AddScoped<ILabService, LabService>();
            builder.Services.AddScoped<ILabBookingService, LabBookingService>();

            // =========================
            // EVENT MODULE
            // =========================
            builder.Services.AddScoped<IEventRepository, EventRepository>();
            builder.Services.AddScoped<IEventRegistrationRepository, EventRegistrationRepository>();

            builder.Services.AddScoped<IEventService, EventService>();
            builder.Services.AddScoped<IEventRegistrationService, EventRegistrationService>();

            // =========================
            // NOTIFICATION MODULE
            // =========================
            builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
            builder.Services.AddScoped<INotificationService, NotificationService>();

            // =========================
            // COMPLAINT MODULE
            // =========================
            builder.Services.AddScoped<IComplaintCategoryRepository, ComplaintCategoryRepository>();
            builder.Services.AddScoped<IComplaintRepository, ComplaintRepository>();

            builder.Services.AddScoped<IComplaintCategoryService, ComplaintCategoryService>();
            builder.Services.AddScoped<IComplaintService, ComplaintService>();

            // =========================
            // CERTIFICATE REQUEST MODULE
            // =========================
            builder.Services.AddScoped<
                ICertificateRequestRepository,
                CertificateRequestRepository>();

            builder.Services.AddScoped<
                ICertificateRequestService,
                CertificateRequestService>();

            // =========================
            // SWAGGER / OPENAPI
            // =========================
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Campus Services Portal API",
                    Version = "v1"
                });

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter your JWT token"
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });

            var app = builder.Build();

            // =========================
            // DATABASE MIGRATION + SEED
            // =========================
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider
                    .GetRequiredService<CampusXDbContext>();

                DbSeeder.SeedAsync(dbContext).GetAwaiter().GetResult();
            }

            // =========================
            // SWAGGER
            // =========================
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAngular");

            // =========================
            // AUTHENTICATION
            // =========================
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}