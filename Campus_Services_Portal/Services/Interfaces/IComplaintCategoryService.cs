using Campus_Services_Portal.DTOs.Complaints;

namespace Campus_Services_Portal.Services.Interfaces
{
    public interface IComplaintCategoryService
    {
        Task<IEnumerable<ComplaintCategoryResponseDto>> GetAllAsync();
    }
}