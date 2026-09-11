using Campus_Services_Portal.DTOs.Complaints;
using Campus_Services_Portal.Models.Entities;
using Campus_Services_Portal.Models.Enums;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class ComplaintService : IComplaintService
    {
        private readonly IComplaintRepository _complaintRepository;
        private readonly IComplaintCategoryRepository _categoryRepository;

        public ComplaintService(
            IComplaintRepository complaintRepository,
            IComplaintCategoryRepository categoryRepository)
        {
            _complaintRepository = complaintRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task<ComplaintResponseDto> CreateComplaintAsync(
            int studentId,
            CreateComplaintDto dto)
        {
            var category =
                await _categoryRepository.GetByIdAsync(dto.CategoryId);

            if (category == null)
            {
                throw new ArgumentException(
                    "Invalid complaint category.");
            }

            var complaint = new Complaint
            {
                StudentId = studentId,
                ComplaintCategoryId = dto.CategoryId,
                Description = dto.Description,
                Status = ComplaintStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            await _complaintRepository.AddAsync(complaint);

            var createdComplaint =
                await _complaintRepository.GetByIdAsync(complaint.Id);

            if (createdComplaint == null)
            {
                throw new Exception(
                    "Complaint could not be created.");
            }

            return MapToDto(createdComplaint);
        }

        public async Task<IEnumerable<ComplaintResponseDto>>
            GetStudentComplaintsAsync(int studentId)
        {
            var complaints =
                await _complaintRepository
                    .GetByStudentIdAsync(studentId);

            return complaints.Select(MapToDto);
        }

        public async Task<IEnumerable<ComplaintResponseDto>>
            GetAllComplaintsAsync(ComplaintStatus? status)
        {
            IEnumerable<Complaint> complaints;

            if (status.HasValue)
            {
                complaints =
                    await _complaintRepository
                        .GetByStatusAsync(status.Value);
            }
            else
            {
                complaints =
                    await _complaintRepository.GetAllAsync();
            }

            return complaints.Select(MapToDto);
        }

        public async Task<ComplaintResponseDto>
            UpdateComplaintStatusAsync(
                int complaintId,
                UpdateComplaintStatusDto dto)
        {
            var complaint =
                await _complaintRepository
                    .GetByIdAsync(complaintId);

            if (complaint == null)
            {
                throw new KeyNotFoundException(
                    "Complaint not found.");
            }

            complaint.Status = dto.Status;
            complaint.ResolutionNote = dto.ResolutionNote;
            complaint.UpdatedAt = DateTime.UtcNow;

            await _complaintRepository.UpdateAsync(complaint);

            return MapToDto(complaint);
        }

        private static ComplaintResponseDto MapToDto(
            Complaint complaint)
        {
            return new ComplaintResponseDto
            {
                Id = complaint.Id,
                StudentId = complaint.StudentId,

                StudentName =
                    complaint.Student?.FullName
                    ?? string.Empty,

                CategoryId =
                    complaint.ComplaintCategoryId,

                CategoryName =
                    complaint.ComplaintCategory?.Name
                    ?? string.Empty,

                Description =
                    complaint.Description,

                Status =
                    complaint.Status.ToString(),

                ResolutionNote =
                    complaint.ResolutionNote,

                CreatedAt =
                    complaint.CreatedAt,

                UpdatedAt =
                    complaint.UpdatedAt
            };
        }
    }
}