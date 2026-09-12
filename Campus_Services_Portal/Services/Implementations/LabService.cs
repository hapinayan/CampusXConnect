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


        // =====================================================
        // GET ALL LABS
        // =====================================================

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


        // =====================================================
        // GET LAB BY ID
        // =====================================================

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


        // =====================================================
        // CREATE LAB
        // =====================================================

        public async Task<LabResponseDto> CreateLabAsync(
            CreateLabDto dto)
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


        // =====================================================
        // UPDATE LAB
        // =====================================================

        public async Task<bool> UpdateLabAsync(
            int id,
            UpdateLabDto dto)
        {
            var lab =
                await _labRepository.GetByIdAsync(id);

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


        // =====================================================
        // GET AVAILABLE TIME SLOTS
        // =====================================================

        public async Task<IEnumerable<AvailableSlotDto>>
            GetLabSlotsAsync(
                int labId,
                DateTime date)
        {
            // -------------------------------------------------
            // FIND LAB
            // -------------------------------------------------

            var lab =
                await _labRepository.GetByIdAsync(labId);

            if (lab == null)
            {
                throw new Exception("Lab not found.");
            }


            // -------------------------------------------------
            // GET BOOKINGS FOR SELECTED DATE
            // -------------------------------------------------

            var bookings =
                await _labBookingRepository
                    .GetByLabAndDateAsync(
                        labId,
                        date);


            // -------------------------------------------------
            // STANDARD LAB TIME SLOTS
            // -------------------------------------------------

            var slots = new[]
            {
                new
                {
                    Start = new TimeSpan(9, 0, 0),
                    End = new TimeSpan(10, 0, 0)
                },

                new
                {
                    Start = new TimeSpan(10, 0, 0),
                    End = new TimeSpan(11, 0, 0)
                },

                new
                {
                    Start = new TimeSpan(11, 0, 0),
                    End = new TimeSpan(12, 0, 0)
                },

                new
                {
                    Start = new TimeSpan(12, 0, 0),
                    End = new TimeSpan(13, 0, 0)
                },

                new
                {
                    Start = new TimeSpan(13, 0, 0),
                    End = new TimeSpan(14, 0, 0)
                },

                new
                {
                    Start = new TimeSpan(14, 0, 0),
                    End = new TimeSpan(15, 0, 0)
                }
            };


            // -------------------------------------------------
            // CREATE SLOT AVAILABILITY
            // -------------------------------------------------

            var result =
                new List<AvailableSlotDto>();


            foreach (var slot in slots)
            {
                // Count bookings overlapping this slot
                var bookedCount =
                    bookings.Count(booking =>
                        booking.StartTime < slot.End &&
                        booking.EndTime > slot.Start);


                // Calculate remaining capacity
                var remainingCapacity =
                    Math.Max(
                        0,
                        lab.Capacity - bookedCount);


                // Check availability
                var isAvailable =
                    lab.IsActive &&
                    bookedCount < lab.Capacity;


                result.Add(
                    new AvailableSlotDto
                    {
                        StartTime = slot.Start,

                        EndTime = slot.End,

                        BookedCount = bookedCount,

                        Capacity = lab.Capacity,

                        RemainingCapacity =
                            remainingCapacity,

                        IsAvailable =
                            isAvailable
                    });
            }


            return result;
        }
    }
}