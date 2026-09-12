using Campus_Services_Portal.DTOs.Certificates;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class CertificateRequestService
        : ICertificateRequestService
    {
        private readonly ICertificateRequestRepository
            _certificateRequestRepository;

        private readonly INotificationService
            _notificationService;


        public CertificateRequestService(
            ICertificateRequestRepository certificateRequestRepository,
            INotificationService notificationService)
        {
            _certificateRequestRepository =
                certificateRequestRepository;

            _notificationService =
                notificationService;
        }


        // =====================================================
        // CREATE CERTIFICATE REQUEST
        // =====================================================

        public async Task<CertificateRequestResponseDto>
            CreateRequestAsync(
                int studentId,
                CreateCertificateRequestDto dto)
        {
            // Validate certificate type
            if (!Enum.IsDefined(
                    typeof(CertificateType),
                    dto.Type))
            {
                throw new ArgumentException(
                    "Invalid certificate type.");
            }


            // Prevent duplicate pending request
            var hasPendingRequest =
                await _certificateRequestRepository
                    .HasPendingRequestAsync(
                        studentId,
                        dto.Type);


            if (hasPendingRequest)
            {
                throw new InvalidOperationException(
                    "A pending certificate request of the same type already exists.");
            }


            var certificateRequest =
                new CertificateRequest
                {
                    StudentId = studentId,

                    Type = dto.Type,

                    Reason = dto.Reason,

                    Status =
                        CertificateRequestStatus.Pending,

                    RequestedAt =
                        DateTime.UtcNow
                };


            await _certificateRequestRepository
                .AddAsync(certificateRequest);


            var createdRequest =
                await _certificateRequestRepository
                    .GetByIdAsync(
                        certificateRequest.Id);


            return MapToDto(
                createdRequest!);
        }


        // =====================================================
        // GET STUDENT REQUESTS
        // =====================================================

        public async Task<
            IEnumerable<CertificateRequestResponseDto>>
            GetStudentRequestsAsync(
                int studentId)
        {
            var requests =
                await _certificateRequestRepository
                    .GetByStudentIdAsync(
                        studentId);


            return requests.Select(
                MapToDto);
        }


        // =====================================================
        // ADMIN - GET ALL REQUESTS
        // =====================================================

        public async Task<
            IEnumerable<CertificateRequestResponseDto>>
            GetAllRequestsAsync(
                CertificateRequestStatus? status)
        {
            var requests =
                await _certificateRequestRepository
                    .GetAllAsync();


            if (status.HasValue)
            {
                if (!Enum.IsDefined(
                        typeof(
                            CertificateRequestStatus),
                        status.Value))
                {
                    throw new ArgumentException(
                        "Invalid certificate request status.");
                }


                requests =
                    requests.Where(
                        r =>
                            r.Status ==
                            status.Value);
            }


            return requests.Select(
                MapToDto);
        }


        // =====================================================
        // ADMIN - UPDATE STATUS
        // =====================================================

        public async Task<CertificateRequestResponseDto>
            UpdateStatusAsync(
                int id,
                UpdateCertificateStatusDto dto)
        {
            // Validate status
            if (!Enum.IsDefined(
                    typeof(
                        CertificateRequestStatus),
                    dto.Status))
            {
                throw new ArgumentException(
                    "Invalid certificate request status.");
            }


            var certificateRequest =
                await _certificateRequestRepository
                    .GetByIdAsync(id);


            if (certificateRequest == null)
            {
                throw new KeyNotFoundException(
                    "Certificate request not found.");
            }


            // Validate transition
            if (!IsValidStatusTransition(
                    certificateRequest.Status,
                    dto.Status))
            {
                throw new ArgumentException(
                    $"Invalid status transition from " +
                    $"{certificateRequest.Status} " +
                    $"to {dto.Status}.");
            }


            // Rejection reason is compulsory
            if (
                dto.Status ==
                CertificateRequestStatus.Rejected
                &&
                string.IsNullOrWhiteSpace(
                    dto.RejectionReason)
            )
            {
                throw new ArgumentException(
                    "Rejection reason is required.");
            }


            // Update request
            certificateRequest.Status =
                dto.Status;

            certificateRequest.UpdatedAt =
                DateTime.UtcNow;


            await _certificateRequestRepository
                .UpdateAsync(
                    certificateRequest);


            // =================================================
            // SEND STUDENT NOTIFICATION
            // =================================================

            switch (dto.Status)
            {
                // ---------------------------------------------
                // APPROVED
                // ---------------------------------------------

                case CertificateRequestStatus.Approved:

                    await _notificationService
                        .CreateNotificationAsync(
                            certificateRequest.StudentId,
                            "Certificate Request Approved",
                            $"Your {certificateRequest.Type} " +
                            $"certificate request has been approved " +
                            $"and is being prepared.",
                            NotificationType.Certificate);

                    break;


                // ---------------------------------------------
                // REJECTED
                // ---------------------------------------------

                case CertificateRequestStatus.Rejected:

                    await _notificationService
                        .CreateNotificationAsync(
                            certificateRequest.StudentId,
                            "Certificate Request Rejected",
                            $"Your {certificateRequest.Type} " +
                            $"certificate request was rejected. " +
                            $"Reason: {dto.RejectionReason!.Trim()}",
                            NotificationType.Certificate);

                    break;


                // ---------------------------------------------
                // ISSUED / READY FOR COLLECTION
                // ---------------------------------------------

                case CertificateRequestStatus.Issued:

                    await _notificationService
                        .CreateNotificationAsync(
                            certificateRequest.StudentId,
                            "Certificate Ready for Collection",
                            $"Your {certificateRequest.Type} " +
                            $"certificate is ready. " +
                            $"Please collect it from the " +
                            $"administration office.",
                            NotificationType.Certificate);

                    break;
            }


            return MapToDto(
                certificateRequest);
        }


        // =====================================================
        // VALID STATUS TRANSITION
        // =====================================================

        private static bool IsValidStatusTransition(
            CertificateRequestStatus currentStatus,
            CertificateRequestStatus newStatus)
        {
            return currentStatus switch
            {
                CertificateRequestStatus.Pending =>
                    newStatus ==
                        CertificateRequestStatus.Approved
                    ||
                    newStatus ==
                        CertificateRequestStatus.Rejected,

                CertificateRequestStatus.Approved =>
                    newStatus ==
                        CertificateRequestStatus.Issued,

                CertificateRequestStatus.Rejected =>
                    false,

                CertificateRequestStatus.Issued =>
                    false,

                _ => false
            };
        }


        // =====================================================
        // MAP ENTITY TO RESPONSE DTO
        // =====================================================

        private static CertificateRequestResponseDto
            MapToDto(
                CertificateRequest request)
        {
            return new CertificateRequestResponseDto
            {
                Id =
                    request.Id,

                StudentId =
                    request.StudentId,

                StudentName =
                    request.Student?.FullName
                    ?? string.Empty,

                Type =
                    request.Type.ToString(),

                Reason =
                    request.Reason,

                Status =
                    request.Status.ToString(),

                RequestedAt =
                    request.RequestedAt,

                UpdatedAt =
                    request.UpdatedAt
            };
        }
    }
}