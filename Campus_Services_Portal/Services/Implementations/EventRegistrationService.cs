using Campus_Services_Portal.DTOs.Events;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class EventRegistrationService : IEventRegistrationService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventRegistrationRepository _eventRegistrationRepository;
        private readonly INotificationService _notificationService;

        public EventRegistrationService(
            IEventRepository eventRepository,
            IEventRegistrationRepository eventRegistrationRepository,
            INotificationService notificationService)
        {
            _eventRepository = eventRepository;
            _eventRegistrationRepository = eventRegistrationRepository;
            _notificationService = notificationService;
        }

        public async Task<EventRegistrationResponseDto> RegisterForEventAsync(
            int studentId,
            CreateEventRegistrationDto dto)
        {
            var eventItem =
                await _eventRepository.GetByIdAsync(dto.EventId);

            if (eventItem == null)
            {
                throw new Exception("Event not found.");
            }

            if (!eventItem.IsActive)
            {
                throw new Exception("Event is not active.");
            }

            if (eventItem.EventDate < DateTime.UtcNow)
            {
                throw new Exception("Event has already passed.");
            }

            var alreadyRegistered =
                await _eventRegistrationRepository
                    .IsStudentRegisteredAsync(
                        dto.EventId,
                        studentId);

            if (alreadyRegistered)
            {
                throw new Exception(
                    "Student is already registered for this event.");
            }

            var registrationCount =
                await _eventRegistrationRepository
                    .GetRegistrationCountAsync(dto.EventId);

            if (registrationCount >= eventItem.Capacity)
            {
                throw new Exception(
                    "Event capacity is full.");
            }

            var registration = new EventRegistration
            {
                EventId = dto.EventId,
                StudentId = studentId,
                RegisteredAt = DateTime.UtcNow
            };

            await _eventRegistrationRepository
                .AddAsync(registration);

            // Create notification only after
            // successful event registration
            await _notificationService.CreateNotificationAsync(
                studentId,
                "Event Registration Successful",
                $"You have successfully registered for {eventItem.Title}.",
                NotificationType.Event);

            return new EventRegistrationResponseDto
            {
                Id = registration.Id,
                EventId = registration.EventId,
                EventTitle = eventItem.Title,
                StudentId = registration.StudentId,
                RegisteredAt = registration.RegisteredAt
            };
        }

        public async Task<IEnumerable<EventRegistrationResponseDto>>
            GetStudentRegistrationsAsync(int studentId)
        {
            var registrations =
                await _eventRegistrationRepository
                    .GetByStudentIdAsync(studentId);

            return registrations.Select(
                registration =>
                    new EventRegistrationResponseDto
                    {
                        Id = registration.Id,
                        EventId = registration.EventId,
                        EventTitle =
                            registration.Event.Title,
                        StudentId =
                            registration.StudentId,
                        RegisteredAt =
                            registration.RegisteredAt
                    });
        }

        public async Task<bool> CancelRegistrationAsync(
            int registrationId,
            int studentId)
        {
            var registration =
                await _eventRegistrationRepository
                    .GetByIdAsync(registrationId);

            if (registration == null)
            {
                return false;
            }

            if (registration.StudentId != studentId)
            {
                throw new UnauthorizedAccessException(
                    "You cannot cancel another student's registration.");
            }

            await _eventRegistrationRepository
                .DeleteAsync(registration);

            return true;
        }
    }
}