using Campus_Services_Portal.DTOs.Complaints;
using Campus_Services_Portal.Repositories.Interfaces;
using Campus_Services_Portal.Services.Interfaces;

namespace Campus_Services_Portal.Services.Implementations
{
    public class ComplaintCategoryService : IComplaintCategoryService
    {
        private readonly IComplaintCategoryRepository _repository;

        public ComplaintCategoryService(IComplaintCategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<ComplaintCategoryResponseDto>> GetAllAsync()
        {
            var categories = await _repository.GetAllAsync();

            return categories.Select(c => new ComplaintCategoryResponseDto
            {
                Id = c.Id,
                Name = c.Name
            });
        }
    }
}