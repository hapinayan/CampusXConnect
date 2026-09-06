using Campus_Services_Portal.DTOs.Labs;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class LabBookingService : ILabBookingService
    {
        private readonly ILabRepository _labRepository;
        private readonly ILabBookingRepository _labBookingRepository;

        public LabBookingService(
            ILabRepository labRepository,
            ILabBookingRepository labBookingRepository)
        {
            _labRepository = labRepository;
            _labBookingRepository = labBookingRepository;
        }

        public async Task<LabBookingResponseDto> CreateBookingAsync(
            int studentId,
            CreateLabBookingDto dto)
        {
            var lab =
                await _labRepository.GetByIdAsync(dto.LabId);

            if (lab == null)
            {
                throw new Exception("Lab not found.");
            }

            if (!lab.IsActive)
            {
                throw new Exception("Lab is not active.");
            }

            if (dto.BookingDate.Date < DateTime.UtcNow.Date)
            {
                throw new Exception(
                    "Booking date cannot be in the past.");
            }

            if (dto.StartTime >= dto.EndTime)
            {
                throw new Exception(
                    "Start time must be before end time.");
            }

            var isBooked =
                await _labBookingRepository.IsSlotBookedAsync(
                    dto.LabId,
                    dto.BookingDate,
                    dto.StartTime,
                    dto.EndTime);

            if (isBooked)
            {
                throw new Exception(
                    "This lab slot is already booked.");
            }

            var booking = new LabBooking
            {
                LabId = dto.LabId,
                StudentId = studentId,
                BookingDate = dto.BookingDate,
                StartTime = dto.StartTime,
                EndTime = dto.EndTime,
                CreatedAt = DateTime.UtcNow
            };

            await _labBookingRepository.AddAsync(booking);

            return new LabBookingResponseDto
            {
                Id = booking.Id,
                LabId = booking.LabId,
                LabName = lab.Name,
                StudentId = booking.StudentId,
                BookingDate = booking.BookingDate,
                StartTime = booking.StartTime,
                EndTime = booking.EndTime,
                CreatedAt = booking.CreatedAt
            };
        }

        public async Task<IEnumerable<LabBookingResponseDto>>
            GetStudentBookingsAsync(int studentId)
        {
            var bookings =
                await _labBookingRepository
                    .GetByStudentIdAsync(studentId);

            return bookings.Select(
                booking => new LabBookingResponseDto
                {
                    Id = booking.Id,
                    LabId = booking.LabId,
                    LabName = booking.Lab.Name,
                    StudentId = booking.StudentId,
                    BookingDate = booking.BookingDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime,
                    CreatedAt = booking.CreatedAt
                });
        }

        public async Task<IEnumerable<LabBookingResponseDto>>
            GetUpcomingBookingsAsync(int studentId)
        {
            var bookings =
                await _labBookingRepository
                    .GetUpcomingByStudentIdAsync(studentId);

            return bookings.Select(
                booking => new LabBookingResponseDto
                {
                    Id = booking.Id,
                    LabId = booking.LabId,
                    LabName = booking.Lab.Name,
                    StudentId = booking.StudentId,
                    BookingDate = booking.BookingDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime,
                    CreatedAt = booking.CreatedAt
                });
        }

        public async Task<IEnumerable<LabBookingResponseDto>>
            GetPastBookingsAsync(int studentId)
        {
            var bookings =
                await _labBookingRepository
                    .GetPastByStudentIdAsync(studentId);

            return bookings.Select(
                booking => new LabBookingResponseDto
                {
                    Id = booking.Id,
                    LabId = booking.LabId,
                    LabName = booking.Lab.Name,
                    StudentId = booking.StudentId,
                    BookingDate = booking.BookingDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime,
                    CreatedAt = booking.CreatedAt
                });
        }

        public async Task<bool> CancelBookingAsync(
            int bookingId,
            int studentId)
        {
            var booking =
                await _labBookingRepository
                    .GetByIdAsync(bookingId);

            if (booking == null)
            {
                return false;
            }

            if (booking.StudentId != studentId)
            {
                throw new UnauthorizedAccessException(
                    "You cannot cancel another student's booking.");
            }

            await _labBookingRepository
                .DeleteAsync(booking);

            return true;
        }
    }
}