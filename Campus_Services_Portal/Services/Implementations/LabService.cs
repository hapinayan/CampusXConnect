using Campus_Services_Portal.DTOs.Labs;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class LabService : ILabService
    {
        private readonly ILabRepository _labRepository;
        private readonly ILabBookingRepository _labBookingRepository;

        public LabService(
            ILabRepository labRepository,
            ILabBookingRepository labBookingRepository)
        {
            _labRepository = labRepository;
            _labBookingRepository = labBookingRepository;
        }

        public async Task<IEnumerable<LabResponseDto>> GetAllLabsAsync()
        {
            var labs = await _labRepository.GetAllAsync();

            return labs.Select(lab => new LabResponseDto
            {
                Id = lab.Id,
                Name = lab.Name,
                Location = lab.Location,
                Capacity = lab.Capacity,
                IsActive = lab.IsActive
            });
        }

        public async Task<LabResponseDto?> GetLabByIdAsync(int id)
        {
            var lab = await _labRepository.GetByIdAsync(id);

            if (lab == null)
            {
                return null;
            }

            return new LabResponseDto
            {
                Id = lab.Id,
                Name = lab.Name,
                Location = lab.Location,
                Capacity = lab.Capacity,
                IsActive = lab.IsActive
            };
        }

        public async Task<LabResponseDto> CreateLabAsync(CreateLabDto dto)
        {
            var lab = new Lab
            {
                Name = dto.Name,
                Location = dto.Location,
                Capacity = dto.Capacity,
                IsActive = true
            };

            await _labRepository.AddAsync(lab);

            return new LabResponseDto
            {
                Id = lab.Id,
                Name = lab.Name,
                Location = lab.Location,
                Capacity = lab.Capacity,
                IsActive = lab.IsActive
            };
        }

        public async Task<bool> UpdateLabAsync(
            int id,
            UpdateLabDto dto)
        {
            var lab = await _labRepository.GetByIdAsync(id);

            if (lab == null)
            {
                return false;
            }

            lab.Name = dto.Name;
            lab.Location = dto.Location;
            lab.Capacity = dto.Capacity;
            lab.IsActive = dto.IsActive;

            await _labRepository.UpdateAsync(lab);

            return true;
        }

        public async Task<IEnumerable<LabBookingResponseDto>>
            GetLabSlotsAsync(
                int labId,
                DateTime date)
        {
            var lab = await _labRepository.GetByIdAsync(labId);

            if (lab == null)
            {
                throw new Exception("Lab not found.");
            }

            var bookings =
                await _labBookingRepository.GetByLabAndDateAsync(
                    labId,
                    date);

            return bookings.Select(booking =>
                new LabBookingResponseDto
                {
                    Id = booking.Id,
                    LabId = booking.LabId,
                    LabName = lab.Name,
                    StudentId = booking.StudentId,
                    BookingDate = booking.BookingDate,
                    StartTime = booking.StartTime,
                    EndTime = booking.EndTime,
                    CreatedAt = booking.CreatedAt
                });
        }
    }
}